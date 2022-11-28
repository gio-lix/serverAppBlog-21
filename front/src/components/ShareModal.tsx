import React, {FC} from 'react';

import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon,
    RedditShareButton, RedditIcon
} from "react-share";

interface Props {
    url: string
}

const ShareModal:FC<Props> = ({url}) => {
    return (
        <div className='shareModal'>
            <EmailShareButton url={url}>
                <EmailIcon round={true} size={30} />
            </EmailShareButton>
            <FacebookShareButton url={url}>
                <FacebookIcon round={true} size={30} />
            </FacebookShareButton>
            <TwitterShareButton url={url}>
                <TwitterIcon round={true} size={30} />
            </TwitterShareButton>
            <WhatsappShareButton url={url}>
                <WhatsappIcon round={true} size={30} />
            </WhatsappShareButton>
            <RedditShareButton url={url}>
                <RedditIcon round={true} size={30} />
            </RedditShareButton>
        </div>
    );
};

export default ShareModal;