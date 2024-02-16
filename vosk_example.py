"""Пример использования VOSK"""

import vosk
import wave
import json
from pydub import AudioSegment

def get_text_from_audio():
    """mp3 в текст"""

    """Загружаем модель"""
    model_path = "vosk-model-small-en-us-0.15" # https://alphacephei.com/vosk/models
    vosk.SetLogLevel(-1)
    model = vosk.Model(model_path)

    """Открываем файл"""
    audio_file = "audio (1).mp3" # аудио для распознавания
    wav_file = "audio.wav"

    """Конвертируем в файл WAV"""
    audio = AudioSegment.from_mp3(audio_file)
    audio.export("audio.wav", format="wav")

    """Открываем WAV"""
    wf = wave.open(wav_file, "rb")

    """Объект распознавания речи"""
    rec = vosk.KaldiRecognizer(model, wf.getframerate())

    """Распознаем текст"""
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            result = rec.Result()
            result = json.loads(result)
            recognized_text = result["text"]
            print(recognized_text)
            return recognized_text

get_text_from_audio()