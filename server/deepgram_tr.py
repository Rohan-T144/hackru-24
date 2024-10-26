from deepgram.utils import verboselogs
import deepgram
from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    LiveTranscriptionEvents,
    LiveOptions,
    Microphone,
)


def make_deepgram():
    dg_connection = deepgram.listen.websocket.v("1")

    def on_open(self, open, **kwargs):
        print("Connection Open")

    def on_message(self, result, **kwargs):
        global is_finals
        sentence = result.channel.alternatives[0].transcript
        if len(sentence) == 0:
            return
        if result.is_final:
            print(f"Message: {result.to_json()}")
            # We need to collect these and concatenate them together when we get a speech_final=true
            # See docs: https://developers.deepgram.com/docs/understand-endpointing-interim-results
            is_finals.append(sentence)

            # Speech Final means we have detected sufficent silence to consider this end of speech
            # Speech final is the lowest latency result as it triggers as soon an the endpointing value has triggered
            if result.speech_final:
                utterance = " ".join(is_finals)
                print(f"Speech Final: {utterance}")
                is_finals = []
            else:
                # These are useful if you need real time captioning and update what the Interim Results produced
                print(f"Is Final: {sentence}")
        else:
            # These are useful if you need real time captioning of what is being spoken
            print(f"Interim Results: {sentence}")

    def on_metadata(self, metadata, **kwargs):
        print(f"Metadata: {metadata}")

    def on_speech_started(self, speech_started, **kwargs):
        print("Speech Started")

    def on_utterance_end(self, utterance_end, **kwargs):
        print("Utterance End")
        global is_finals
        if len(is_finals) > 0:
            utterance = " ".join(is_finals)
            print(f"Utterance End: {utterance}")
            is_finals = []

    def on_close(self, close, **kwargs):
        print("Connection Closed")

    def on_error(self, error, **kwargs):
        print(f"Handled Error: {error}")

    def on_unhandled(self, unhandled, **kwargs):
        print(f"Unhandled Websocket Message: {unhandled}")

    dg_connection.on(LiveTranscriptionEvents.Open, on_open)
    dg_connection.on(LiveTranscriptionEvents.Transcript, on_message)
    dg_connection.on(LiveTranscriptionEvents.Metadata, on_metadata)
    dg_connection.on(LiveTranscriptionEvents.SpeechStarted, on_speech_started)
    dg_connection.on(LiveTranscriptionEvents.UtteranceEnd, on_utterance_end)
    dg_connection.on(LiveTranscriptionEvents.Close, on_close)
    dg_connection.on(LiveTranscriptionEvents.Error, on_error)
    dg_connection.on(LiveTranscriptionEvents.Unhandled, on_unhandled)

    options: LiveOptions = LiveOptions(
        model="nova-2",
        language="en-US",
        # Apply smart formatting to the output
        smart_format=True,
        # Raw audio format details
        # encoding="linear16",
        # channels=1,
        # sample_rate=16000,
        # To get UtteranceEnd, the following must be set:
        interim_results=True,
        # utterance_end_ms="1000",
        # vad_events=True,
        # Time in milliseconds of silence to wait for before finalizing speech
        # endpointing=300,
    )

    addons = {
        # Prevent waiting for additional numbers
        "no_delay": "true"
    }
    dg_connection.close()
    print("\n\nPress Enter to stop recording...\n\n")
    if dg_connection.start(options, addons=addons) is False:
        print("Failed to connect to Deepgram")
        # return

    return dg_connection

