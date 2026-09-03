const backgrounds = [
  "/media/gallery-1.svg",
  "/media/about-cover.svg",
  "/media/gallery-4.svg"
];

export default function BackgroundStage() {
  return <div className="site-background" aria-hidden="true">
    {backgrounds.map((src, index) => <div
      className={`site-background__image site-background__image--${["one", "two", "three"][index]}`}
      key={src}
      style={{ backgroundImage: `url(${src})` }}
    />)}
    <div className="site-background__veil" />
    <div className="site-background__wash" />
    <div className="site-background__grain" />
  </div>;
}
