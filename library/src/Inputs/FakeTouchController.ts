import { ITouchController } from "./ITouchController";
import { MouseButton } from "./MouseButtons";
import { IStreamMessageController } from "../UeInstanceMessage/IStreamMessageController";
import { IVideoPlayer } from "../VideoPlayer/IVideoPlayer";
import { INormalizeAndQuantize } from "../NormalizeAndQuantize/INormalizeAndQuantize";


/**
 * Allows for the usage of fake touch events and implements ITouchController
 * @param dataChannelController - The controller for the Data channel 
 * @param videovideoElementParent - The video player DOM element 
 */
export class FakeTouchController implements ITouchController {
    fakeTouchFinger: FakeTouchFinger;
    toStreamerMessagesProvider: IStreamMessageController;
    videoElementProvider: IVideoPlayer;
    normalizeAndQuantize: INormalizeAndQuantize;
    videoElementParentClientRect: DOMRect;

    /**
     * @param toStreamerMessagesProvider - Stream message instance
     * @param videoElementProvider - Video element instance
     * @param normalizeAndQuantize - Normalise and Quantize instance
     */
    constructor(toStreamerMessagesProvider: IStreamMessageController, videoElementProvider: IVideoPlayer, normalizeAndQuantize: INormalizeAndQuantize) {
        this.toStreamerMessagesProvider = toStreamerMessagesProvider;
        this.videoElementProvider = videoElementProvider;
        this.normalizeAndQuantize = normalizeAndQuantize;
        document.ontouchstart = (ev: TouchEvent) => this.onTouchStart(ev);
        document.ontouchend = (ev: TouchEvent) => this.onTouchEnd(ev);
        document.ontouchmove = (ev: TouchEvent) => this.onTouchMove(ev);
    }

    /**
     * Sets the video Element Parent Client Rect numbers for this class 
     * @param videoElementParentClientRect - a html ElementParentClientRect object
     */
    setVideoElementParentClientRect(videoElementParentClientRect: any) {
        this.videoElementParentClientRect = videoElementParentClientRect;
    }

    /**
     * When a touch event begins 
     * @param touch - the activating touch event 
     */
    onTouchStart(touch: TouchEvent): void {
        if(!this.videoElementProvider.isVideoReady()){ return; }
        if (this.fakeTouchFinger == null) {
            const first_touch = touch.changedTouches[0];
            this.fakeTouchFinger = new FakeTouchFinger(first_touch.identifier, first_touch.clientX - this.videoElementParentClientRect.left, first_touch.clientY - this.videoElementParentClientRect.top);

            const videoElementParent = this.videoElementProvider.getVideoParentElement() as HTMLDivElement;
            const mouseEvent = new MouseEvent(touch.type, first_touch);
            videoElementParent.onmouseenter(mouseEvent);

            const coord = this.normalizeAndQuantize.normalizeAndQuantizeUnsigned(this.fakeTouchFinger.x, this.fakeTouchFinger.y);
            const toStreamerHandlers = this.toStreamerMessagesProvider.getToStreamHandlersMap();
            toStreamerHandlers.get("MouseDown")("MouseDown", [MouseButton.mainButton, coord.x, coord.y]);
        }
        touch.preventDefault();
    }

    /**
     * When a touch event ends 
     * @param touchEvent - the activating touch event 
     */
    onTouchEnd(touchEvent: TouchEvent): void {
        if(!this.videoElementProvider.isVideoReady()){ return; }
        const videoElementParent = this.videoElementProvider.getVideoParentElement();
        const toStreamerHandlers = this.toStreamerMessagesProvider.getToStreamHandlersMap();

        for (let t = 0; t < touchEvent.changedTouches.length; t++) {
            const touch = touchEvent.changedTouches[t];
            if (touch.identifier === this.fakeTouchFinger.id) {
                const x = touch.clientX - this.videoElementParentClientRect.left;
                const y = touch.clientY - this.videoElementParentClientRect.top;
                const coord = this.normalizeAndQuantize.normalizeAndQuantizeUnsigned(x, y);
                toStreamerHandlers.get("MouseUp")("MouseUp", [MouseButton.mainButton, coord.x, coord.y]);

                const mouseEvent = new MouseEvent(touchEvent.type, touch);
                videoElementParent.onmouseleave(mouseEvent);
                this.fakeTouchFinger = null;
                break;
            }
        }
        touchEvent.preventDefault();
    }

    /**
     * On a Move touch event 
     * @param touchEvent - the activating touch event 
     */
    onTouchMove(touchEvent: TouchEvent): void {
        if(!this.videoElementProvider.isVideoReady()){ return; }
        const toStreamerHandlers = this.toStreamerMessagesProvider.getToStreamHandlersMap();

        for (let t = 0; t < touchEvent.touches.length; t++) {
            const touch = touchEvent.touches[t];
            if (touch.identifier === this.fakeTouchFinger.id) {
                const x = touch.clientX - this.videoElementParentClientRect.left;
                const y = touch.clientY - this.videoElementParentClientRect.top;
                const coord = this.normalizeAndQuantize.normalizeAndQuantizeUnsigned(x, y);
                const delta = this.normalizeAndQuantize.normalizeAndQuantizeSigned(x - this.fakeTouchFinger.x, y - this.fakeTouchFinger.y);
                toStreamerHandlers.get("MoveMouse")("MouseMove", [coord.x, coord.y, delta.x, delta.y]);
                this.fakeTouchFinger.x = x;
                this.fakeTouchFinger.y = y;
                break;
            }
        }
        touchEvent.preventDefault();
    }
}

/**
 * The interface for finger position mapping 
 */
export class FakeTouchFinger {
    id: number;
    x: number;
    y: number;

    /**
     * @param id - the button id 
     * @param x - the x axis value 
     * @param y - the y axis value
     */
    constructor(id: number, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}