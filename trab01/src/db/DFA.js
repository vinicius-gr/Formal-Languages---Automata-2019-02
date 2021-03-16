export const dfaRawData = {
    "states": [
        "S0",
        "S1",
        "S2",
        "S3",
        "S4"
    ],
    "alphabet": "01",
    "transitions": {
        "S0": {
            "0": "S1",
            "1": "S0"
        },
        "S1": {
            "0": "S2",
            "1": "S0"
        },
        "S2": {
            "0": "S2",
            "1": "S3"
        },
        "S3": {
            "0": "S1",
            "1": "S4"
        },
        "S4": {
            "0": "S4",
            "1": "S4"
        }
    },
    "start": "S0",
    "acceptStates": [
        "S4"
    ]
}