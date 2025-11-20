import React from 'react';

const HeroSection = () => {
  return (
    <main className="inline content-full">
      <section className="Hero inline gap-2">
        <div className="Wrapper block content-3">
          <div className="Visual block-center-center">
            <PictureComponent 
              className="FirstPic"
              desktopSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-3"
              mobileSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-3"
              altText="Stories Unveiled"
            />
            <PictureComponent 
              className="SecondPic"
              desktopSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-2"
              mobileSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-2"
              altText="Celebrating Life Together"
            />
            <PictureComponent 
              className="ThirdPic"
              desktopSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-desktop-1"
              mobileSrc="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/stories-with-scroll-driven/images/img-mobile-1"
              altText="The Art of Giving"
            />
          </div>
        </div>

        <div className="Content block">
          <ContentLockup 
            id="StoriesUnveiled"
            title="Stories Unveiled"
            subhead="Capture the essence of family celebration."
            description="Share the moments that weave your family tale."
          />
          <ContentLockup 
            id="CelebratingLifeTogether"
            title="Celebrating Life Together"
            subhead="Embrace the significance of shared joy."
            description="In every celebration, find the heartwarming stories."
          />
          <ContentLockup 
            id="TheArtofGiving"
            title="The Art of Giving"
            subhead="Explore the stories within each present."
            description="Every gift is a chapter in your family's narrative."
          />
        </div>

        <div className="SmallScreenContent block-center-center">
          <p className="FirstStory">The Art of Giving</p>
          <p className="SecondStory">Celebrating Life Together</p>
          <p className="ThirdStory">Stories Unveiled</p>
        </div>
      </section>
    </main>
  );
};

const PictureComponent = ({ className, desktopSrc, mobileSrc, altText }) => {
  return (
    <picture className={className}>
      <source
        srcSet={`${desktopSrc}.avif`}
        media="(min-width: 1024px)"
        type="image/avif"
      />
      <source
        srcSet={`${mobileSrc}.avif`}
        type="image/avif"
      />
      <source
        srcSet={`${desktopSrc}.webp`}
        media="(min-width: 1024px)"
        type="image/webp"
      />
      <img
        src={`${mobileSrc}.webp`}
        alt={altText}
      />
    </picture>
  );
};

const ContentLockup = ({ id, title, subhead, description }) => {
  return (
    <div id={id} className="block-center-start">
      <div className="block gap-3">
        <h3>{title}</h3>
        <div className="subhead">{subhead}</div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default HeroSection;
