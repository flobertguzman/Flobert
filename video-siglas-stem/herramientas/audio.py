#!/usr/bin/env python3
"""Banda sonora del reel «Significado de las siglas STEM» (60 s).

Entradas : audio/voz_original/*.mp3  (locución generada por frases)
Salidas  : entregables/locucion_60s.wav          voz sola, alineada a las escenas
           entregables/musica_y_efectos_60s.wav  música + efectos, sin voz
           entregables/mezcla_60s.wav            mezcla final (música baja 11 dB bajo la voz)
           src/datos/subtitulos.json             tiempos palabra por palabra (los lee Remotion)
           entregables/guion_tiempos.srt         subtítulos por bloque

Requiere ffmpeg y numpy. Uso:  python3 herramientas/audio.py
Los efectos y la música se sintetizan aquí mismo (sin archivos externos ni licencias).
"""
import json
import re
import subprocess
from pathlib import Path

import numpy as np

SR = 48000
DUR = 60.0
RAIZ = Path(__file__).resolve().parent.parent
VOZ = RAIZ / 'audio' / 'voz_original'
SALIDA = RAIZ / 'entregables'
DATOS = RAIZ / 'src' / 'datos'
MARGEN = 0.03  # segundos de aire que se conservan antes y después de cada frase

# (archivo, inicio de la voz en s, tempo, bloques de subtítulo; *palabra* = palabra clave)
FRASES = [
    ('00a_que_son', 1.0, 1.00, ['¿Qué son las', 'carreras *STEM*?']),
    ('00b_cuatro_areas', 4.0, 1.00, ['Son cuatro *áreas*', 'para entender el *mundo*']),
    ('01_gancho', 7.4, 1.00, ['Cuatro *letras* que', 'reúnen muchas *carreras*']),
    ('02_S', 11.4, 1.00, ['S, de Science: *ciencia*']),
    ('03_T', 15.7, 1.00, ['T, de Technology: *tecnología*']),
    ('04_E', 20.0, 1.00, ['E, de Engineering: *ingeniería*']),
    ('05_M', 24.3, 1.00, ['M, de Mathematics: *matemáticas*']),
    ('05b_estudian', 28.6, 1.00, ['Estudian cómo funciona', 'el *mundo* y nos ayudan', 'a *investigar*,', 'crear *herramientas*', 'y resolver *problemas*']),
    ('05c_ejemplos', 35.4, 1.00, ['Algunos ejemplos', 'de carreras *STEM*:', '*biología*, *informática*,', '*ingeniería* *civil*', 'y *estadística*']),
    ('06_juntas', 42.4, 1.00, ['Cada área tiene', 'sus propias carreras,', 'pero muchas', 'trabajan *juntas*']),
    ('07_robot', 47.1, 1.00, ['Para crear un *robot*,', 'por ejemplo, se combinan', '*programación*, *ingeniería*', 'y *matemáticas*']),
    ('08_pregunta', 54.1, 1.00, ['¿Qué área te da', 'más *curiosidad*?']),
]

rng = np.random.default_rng(7)


def ffmpeg(args, entrada=None):
    return subprocess.run(['ffmpeg', '-v', 'error', *args], input=entrada, check=True, capture_output=True).stdout


def decodificar(ruta, tempo=1.0):
    filtro = f'atempo={tempo}' if tempo != 1.0 else 'anull'
    raw = ffmpeg(['-i', str(ruta), '-af', filtro, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'])
    return np.frombuffer(raw, dtype='<f4').copy()


def recortar(x, umbral_db=-42):
    """Quita el silencio de los extremos y deja MARGEN de aire."""
    v = int(SR * 0.01)
    n = len(x) // v
    env = np.sqrt((x[:n * v].reshape(n, v) ** 2).mean(axis=1) + 1e-12)
    ok = np.where(20 * np.log10(env) > umbral_db)[0]
    a = max(0, ok[0] * v - int(MARGEN * SR))
    b = min(len(x), (ok[-1] + 1) * v + int(MARGEN * SR))
    return x[a:b]


def escribir_wav(ruta, mono_o_estereo, bits=24):
    x = np.clip(mono_o_estereo, -1, 1).astype('<f4')
    canales = 1 if x.ndim == 1 else x.shape[1]
    ffmpeg(['-f', 'f32le', '-ar', str(SR), '-ac', str(canales), '-i', '-', '-c:a', f'pcm_s{bits}le', '-y', str(ruta)], x.tobytes())


def a_estereo(x):
    return np.stack([x, x], axis=1)


# ───────── Locución y tiempos por palabra ─────────
def silabas(palabra):
    p = re.sub(r'[^a-záéíóúüñ]', '', palabra.lower())
    if len(p) == 1:
        return 2.0  # una letra sola se deletrea: «ese», «te», «e», «eme»
    return max(1, len(re.findall(r'[aeiouáéóüy]+[iuíú]?|[íú]', p)))


def construir_voz():
    voz = np.zeros(int(DUR * SR), dtype=np.float32)
    bloques = []
    for archivo, inicio, tempo, chunks in FRASES:
        x = recortar(decodificar(VOZ / f'{archivo}.mp3', tempo))
        a = int((inicio - MARGEN) * SR)
        voz[a:a + len(x)] += x
        habla = len(x) / SR - 2 * MARGEN
        # palabras con peso = sílabas (+ pausa tras coma o dos puntos)
        palabras = []
        for i, ch in enumerate(chunks):
            for w in ch.split():
                clave = w.startswith('*') or w.endswith('*') or w.endswith('*,') or w.endswith('*?')
                limpio = w.replace('*', '')
                pausa = 0.9 if re.search(r'[,:]$', limpio) else 0.0
                palabras.append({'t': limpio, 'clave': clave, 'bloque': i, 'peso': silabas(limpio), 'pausa': pausa})
        total = sum(p['peso'] + p['pausa'] for p in palabras)
        cursor = inicio
        for p in palabras:
            p['s'] = round(cursor, 3)
            cursor += habla * p['peso'] / total
            p['e'] = round(cursor, 3)
            cursor += habla * p['pausa'] / total
        for i in range(len(chunks)):
            ws = [p for p in palabras if p['bloque'] == i]
            bloques.append({'inicio': ws[0]['s'], 'fin': ws[-1]['e'], 'palabras': [{'t': p['t'], 's': p['s'], 'clave': p['clave']} for p in ws]})
    # cada bloque se queda en pantalla hasta un instante antes del siguiente (máx. 0,45 s de cola)
    for i, b in enumerate(bloques):
        sig = bloques[i + 1]['inicio'] - 0.04 if i + 1 < len(bloques) else DUR
        b['fin'] = round(min(b['fin'] + 0.45, sig), 3)
    return voz, bloques


def srt(bloques):
    def t(s):
        h, r = divmod(s, 3600)
        m, r = divmod(r, 60)
        return f'{int(h):02d}:{int(m):02d}:{int(r):02d},{int(round((r - int(r)) * 1000)):03d}'
    out = []
    for i, b in enumerate(bloques, 1):
        out.append(f"{i}\n{t(b['inicio'])} --> {t(b['fin'])}\n{' '.join(p['t'] for p in b['palabras'])}\n")
    return '\n'.join(out)


# ───────── Efectos sintetizados ─────────
def tiempo(d):
    return np.arange(int(d * SR)) / SR


def lowpass_variable(x, fc):
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def impacto(vol=1.0):
    t = tiempo(0.55)
    f = 46 + 95 * np.exp(-t * 20)
    cuerpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    chasquido = np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t * 110) * 0.22
    return (cuerpo * 0.95 + chasquido) * vol


def whoosh(d, vol=1.0, sube=True):
    t = tiempo(d)
    u = t / d
    fc = (250 + 5200 * u ** 1.6) if sube else (5200 - 4900 * u ** 0.7)
    ruido = rng.standard_normal(len(t))
    y = lowpass_variable(lowpass_variable(ruido, fc), fc)
    y -= lowpass_variable(y, np.full_like(t, 160))
    env = np.sin(np.pi * np.clip(u ** (0.7 if sube else 1.4), 0, 1)) ** 1.6
    y = y * env
    return y / (np.abs(y).max() + 1e-9) * 0.55 * vol


def pop(f0=700.0, vol=1.0):
    t = tiempo(0.16)
    f = f0 * (1 + 0.5 * np.exp(-t * 55))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30) * 0.55 * vol


def campana(f0, d=1.4, vol=1.0):
    t = tiempo(d)
    y = sum(a * np.sin(2 * np.pi * f0 * k * t) * np.exp(-t * dec) for k, a, dec in [(1, 1.0, 3.2), (2.76, 0.35, 5.0), (5.4, 0.12, 8.0)])
    return y * 0.4 * vol


def brillo(vol=1.0):
    y = np.zeros(int(1.6 * SR))
    for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        c = campana(f, 1.0, 0.45)
        a = int(i * 0.09 * SR)
        y[a:a + len(c)] += c[:len(y) - a]
    return y * vol


# (segundo, función) — alineados con la línea de tiempo de src/tiempos.ts
def momento(bloques, palabra, desde=0.0):
    """Segundo en que la voz empieza a decir `palabra` (primera aparición desde `desde`)."""
    for b in bloques:
        for p in b['palabras']:
            if p['s'] >= desde and re.sub(r'[^\wáéíóúüñ]', '', p['t'].lower()) == palabra:
                return p['s']
    raise KeyError(palabra)


# Cortes entre escenas (s); deben coincidir con src/tiempos.ts
CORTES = [7.0, 11.0, 15.3, 19.6, 23.9, 28.2, 35.0, 42.0, 46.8, 53.8, 57.0]


def lista_efectos(bloques):
    m = lambda w, d=0.0: momento(bloques, w, d)
    ef = []
    # apertura: las letras de STEM suben una a una (fotogramas 36–60) y entra la banda
    ef += [(0.7, lambda: brillo(0.35))]
    ef += [((36 + 6 * k) / 30, (lambda k=k: pop(620 + 90 * k, 0.28))) for k in range(5)]
    ef += [(1.8, lambda: whoosh(0.9, 0.3)), (3.4, lambda: pop(760, 0.22))]
    # transiciones suaves entre escenas
    ef += [(c - 0.3, (lambda: whoosh(0.55, 0.32))) for c in CORTES]
    # «Cuatro letras…»: las cuatro fichas
    ef += [(7.0 + (12 + 6 * k) / 30, (lambda k=k: pop(700 + 80 * k, 0.25))) for k in range(4)]
    # cada letra: palabra en inglés y en español, luego tres o cuatro ejemplos de carreras
    for ini, en, es, n in ((11.0, 'science', 'ciencia', 3), (15.3, 'technology', 'tecnología', 2), (19.6, 'engineering', 'ingeniería', 4), (23.9, 'mathematics', 'matemáticas', 2)):
        ef += [(m(en, ini), lambda: pop(820, 0.25)), (m(es, ini), lambda: campana(1046.5, 1.0, 0.35))]
        ef += [(m(es, ini) + 0.9 + 0.22 * k, (lambda k=k: pop(900 + 60 * k, 0.18))) for k in range(n)]
    # «Estudian…»: investigar, herramientas, problemas
    ef += [(m(w, 28.2), lambda: pop(760, 0.3)) for w in ('investigar', 'herramientas', 'problemas')]
    # ejemplos de carreras
    ef += [(m(w, 35.0), lambda: pop(820, 0.3)) for w in ('biología', 'informática', 'ingeniería', 'estadística')]
    # las cuatro fichas se juntan en «juntas»
    j = m('juntas', 42.0)
    ef += [(j - 0.6, lambda: riser(0.6, 0.35)), (j, lambda: campana(784.0, 1.4, 0.5)), (j + 0.05, lambda: brillo(0.35))]
    # robot: cada sumando y el resultado
    ef += [(m(w, 46.8) - 0.1, lambda: pop(700, 0.35)) for w in ('programación', 'ingeniería', 'matemáticas')]
    igual = momento_igual(bloques)
    ef += [(igual, lambda: campana(880.0, 1.6, 0.6)), (igual + 0.05, lambda: brillo(0.45))]
    # pregunta y cierre
    ef += [(53.8 + (14 + 4 * k) / 30, (lambda k=k: pop(800 + 70 * k, 0.25))) for k in range(4)]
    ef += [(57.25, lambda: brillo(0.6)), (57.55, lambda: campana(1046.5, 1.8, 0.55))]
    return ef


def momento_igual(bloques):
    """«= un robot» aparece justo después de que termina la frase del robot."""
    for b in bloques:
        if b['palabras'][-1]['t'].startswith('matemáticas') and b['inicio'] > 47:
            return round(b['fin'] - 0.25, 3)
    raise KeyError('robot')


def efectos(bloques):
    pista = np.zeros(int(DUR * SR))
    for t, fn in lista_efectos(bloques):
        x = fn()
        a = int(t * SR)
        pista[a:a + len(x)] += x[:len(pista) - a]
    return pista


# ───────── Música base (sintetizada) ─────────
def sumar(out, x, s0):
    if 0 <= s0 < len(out):
        seg = x[:len(out) - s0]
        out[s0:s0 + len(seg)] += seg


def nota(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def riser(d, vol=1.0):
    t = tiempo(d)
    u = t / d
    y = lowpass_variable(rng.standard_normal(len(t)), 300 + 7000 * u ** 2)
    y = y / (np.abs(y).max() + 1e-9) * u ** 2 * 0.5
    tono = np.sin(2 * np.pi * np.cumsum(220 + 880 * u ** 2) / SR) * u ** 3 * 0.12
    return (y + tono) * vol


def palmada(vol=1.0):
    t = tiempo(0.2)
    y = np.zeros(len(t))
    for k, dly in enumerate((0.0, 0.009, 0.019)):
        a = int(dly * SR)
        r = np.diff(rng.standard_normal(len(t) - a + 1))
        y[a:] += r * np.exp(-t[: len(t) - a] * (60 if k < 2 else 22)) * (0.7 if k < 2 else 1.0)
    return y * 0.06 * vol


CORTE_MUSICA = [0.0, 0.0]  # se vacía el ritmo justo antes del «= un robot» (se fija en main)


def musica():
    bpm = 100
    beat = 60 / bpm
    bar = 4 * beat
    out = np.zeros(int(DUR * SR))
    acordes = [(57, [57, 64, 69, 72, 76]), (53, [53, 60, 65, 69, 72]), (48, [48, 55, 60, 64, 67]), (55, [55, 62, 67, 71, 74])]  # Lam Fa Do Sol
    libre = lambda ts: not (CORTE_MUSICA[0] <= ts < CORTE_MUSICA[1]) and ts < DUR - 1.0
    for b in range(int(DUR / bar) + 1):
        raiz, notas = acordes[b % 4]
        t0 = b * bar
        t = tiempo(bar + 0.6)
        env = np.minimum(t / 0.4, 1) * np.exp(-np.maximum(t - bar, 0) * 6)
        for m in notas:
            for det in (-0.07, 0.07):
                fr = nota(m) * 2 ** (det / 12)
                sumar(out, (np.sin(2 * np.pi * fr * t) + 0.35 * np.sin(4 * np.pi * fr * t)) * env * 0.03 / 2, int(t0 * SR))
        for i, k in enumerate([0, 2, 3, 2, 1, 3, 4, 3]):
            ts = t0 + i * beat / 2
            m = notas[k] + 12
            tn = tiempo(0.6)
            pl = (np.sin(2 * np.pi * nota(m) * tn) + 0.3 * np.sin(4 * np.pi * nota(m) * tn) + 0.1 * np.sin(6 * np.pi * nota(m) * tn)) * np.exp(-tn * 8) * 0.07
            sumar(out, pl, int(ts * SR))
        for pos in (0, 1.5, 2, 3):  # bajo sincopado
            ts = t0 + pos * beat
            if libre(ts):
                tn = tiempo(beat * 1.2)
                sumar(out, np.tanh(2 * np.sin(2 * np.pi * nota(raiz - 12) * tn)) * np.exp(-tn * 4) * 0.12, int(ts * SR))
        for i in range(4):  # bombo a negras desde el principio
            ts = t0 + i * beat
            if libre(ts):
                tn = tiempo(0.35)
                fr = 46 + 90 * np.exp(-tn * 30)
                sumar(out, np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tn * 10) * (0.14 if ts < 7 else 0.2), int(ts * SR))
            if i in (1, 3) and ts >= 11 and libre(ts):  # palmas en 2 y 4
                sumar(out, palmada(), int(ts * SR))
        for i in range(16):  # charles: corcheas desde los 3 s, semicorcheas desde los 15 s
            ts = t0 + i * beat / 4
            if ts >= 7 and libre(ts) and (i % 2 == 1 or 42.0 <= ts < 57.0):
                tn = tiempo(0.05)
                sumar(out, np.diff(rng.standard_normal(len(tn) + 1)) * np.exp(-tn * 90) * (0.045 if i % 2 else 0.025), int(ts * SR))
    for ts, d in ((41.0, 1.0), (CORTE_MUSICA[1] - 1.0, 1.0)):
        sumar(out, riser(d, 0.6), int(ts * SR))
    d = int(beat * 0.75 * SR)
    eco = out.copy()
    for k, g in ((1, 0.28), (2, 0.12)):
        eco[k * d:] += out[:len(out) - k * d] * g
    fin = np.clip((DUR - tiempo(DUR)) / 1.6, 0, 1)
    ini = np.clip(tiempo(DUR) / 0.05, 0, 1)
    return eco * fin * ini


def rms_db(x):
    return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)


def envolvente(voz, ventana=0.05):
    v = int(ventana * SR)
    n = len(voz) // v
    e = np.sqrt((voz[:n * v].reshape(n, v) ** 2).mean(axis=1))
    return np.repeat(e, v)[:len(voz)] if n * v == len(voz) else np.concatenate([np.repeat(e, v), np.zeros(len(voz) - n * v)])


def ducking(voz, bajada_db=11.0, ataque=0.08, relevo=0.45):
    activa = (envolvente(voz) > 0.01).astype(float)
    g = np.zeros_like(activa)
    acc = 0.0
    a_at, a_re = 1 - np.exp(-1 / (ataque * SR)), 1 - np.exp(-1 / (relevo * SR))
    for i in range(0, len(activa), 8):  # paso de 8 muestras: suficiente para una envolvente de gestos lentos
        objetivo = activa[i]
        acc += (a_at if objetivo > acc else a_re) * (objetivo - acc) * 8
        g[i:i + 8] = acc
    return 10 ** (-bajada_db * g / 20)


def masterizar(entrada, salida, objetivo=-15.0, techo=0.72):
    """Loudnorm en dos pasadas (ganancia lineal) + limitador sobremuestreado para que el pico real quede bajo −1 dBTP."""
    med = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(entrada), '-af', f'loudnorm=I={objetivo}:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(med[med.rindex('{'):med.rindex('}') + 1])
    filtro = (
        f"loudnorm=I={objetivo}:TP=-2:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,"
        f"aresample=192000,alimiter=limit={techo}:attack=1:release=60:level=false,aresample={SR}"
    )
    ffmpeg(['-i', str(entrada), '-af', filtro, '-ar', str(SR), '-c:a', 'pcm_s24le', '-y', str(salida)])


def main():
    SALIDA.mkdir(exist_ok=True)
    DATOS.mkdir(parents=True, exist_ok=True)
    voz, bloques = construir_voz()
    voz *= 10 ** ((-19 - rms_db(voz[np.abs(voz) > 0.01])) / 20)  # voz a ≈ −19 dB RMS mientras habla

    igual = momento_igual(bloques)
    CORTE_MUSICA[:] = [igual - 0.5, igual]
    fx = efectos(bloques)
    mus = musica()
    mus *= 10 ** ((-23 - rms_db(mus)) / 20)
    fx *= 10 ** ((-6.5 - 20 * np.log10(np.abs(fx).max() + 1e-9)) / 20)
    base = mus * ducking(voz) + fx * 0.85

    escribir_wav(SALIDA / 'locucion_60s.wav', a_estereo(voz))
    escribir_wav(SALIDA / 'musica_y_efectos_60s.wav', a_estereo(np.tanh(base)))
    mezcla = np.tanh(voz + base)
    tmp = SALIDA / '_mezcla_cruda.wav'
    escribir_wav(tmp, a_estereo(mezcla), 24)
    masterizar(tmp, SALIDA / 'mezcla_60s.wav')
    tmp.unlink()

    (DATOS / 'subtitulos.json').write_text(json.dumps(bloques, ensure_ascii=False, indent=1), encoding='utf-8')
    (SALIDA / 'guion_tiempos.srt').write_text(srt(bloques), encoding='utf-8')
    print(f'{len(bloques)} bloques de subtítulos; audio listo en {SALIDA}')


if __name__ == '__main__':
    main()
