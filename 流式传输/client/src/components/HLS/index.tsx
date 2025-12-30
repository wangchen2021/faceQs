import { VideoPlayer } from '@videojs-player/react'
import 'video.js/dist/video-js.css'
import { cdn_load } from '../../constant'

const videoSrc = cdn_load("t1_m3u8/master.m3u8")

const HLS = () => {
    return (
        <div>
            <VideoPlayer id='video' playsinline src={videoSrc} controls loop={true} />
        </div>
    )
}

export default HLS
