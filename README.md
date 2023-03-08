# Scalable Pixel Streaming Frontend

This is the web frontend for [Scalable Pixel Streaming (SPS)](https://scalablestreaming.io). 

The SPS frontend is a lightweight implementation of Epic Games' [Pixel Streaming frontend](https://github.com/EpicGames/PixelStreamingInfrastructure/tree/master/Frontend). 

## Features of the SPS Frontend

- [Extensions](./SPS/src/SignallingExtension.ts) to the default signalling messages to communicate with our custom signalling server.
- The sending of [streaming statistics](./SPS/src/SPSApplication.ts#L38) to our signalling server.

## Documentation

- [Migrating from SPS frontend <=0.1.4](./SPS/docs/api_transition_guide.md)

## Issues

As the SPS frontend is a lightweight implementation of the Epic Games frontend, the majority of issues should be reported to the Epic Games frontend [here](https://github.com/EpicGames/PixelStreamingInfrastructure/issues).

However, in cases where you are certain it is an SPS specific frontend issue, please report your issue [here](https://github.com/ScalablePixelStreaming/Frontend/issues).


## Legal

Copyright &copy; 2021 - 2023, TensorWorks Pty Ltd. Licensed under the MIT License, see the file [LICENSE](./LICENSE) for details.
