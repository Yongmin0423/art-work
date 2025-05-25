export default function CategoryCard({
  title = 'charater',
  imageUrl = 'https://i.namu.wiki/i/R-92H0KLN-wen6aNLzERBpLNtAU6o8QTzwjI0cbKGVpyrIWart56j-NhtiOwtDd1EIRy-hQg0jLgbSRIZ_CJoQ.webp',
}: {
  title: string;
  imageUrl: string;
}) {
  return (
    <div className="border shadow-2xl mt-5 rounded-2xl">
      <div>
        <img
          src={imageUrl}
          alt="카테고리 이미지 "
        />
      </div>
      <div className="flex flex-col items-center py-5">
        <h3>{title}</h3>
      </div>
    </div>
  );
}
