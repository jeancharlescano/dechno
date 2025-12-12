import { Article } from "@/@types/Article";
import Link from "next/link";

const Card = ({ article }: { article: Article }) => {
  console.log("🚀 ~ Card ~ article:", article);
  return (
    <Link
      href={article.link}
      target="_blank"
      className="flex flex-col justify-between bg-[#1B1F26] h-92 w-full border-gray-700 border rounded-xl py-4 px-2 hover:scale-105 transition-transform duration-200"
    >
      <span className="text-neutral-400 mb-4">{article.author}</span>
      <h1 className="text-white font-bold text-lg  max-h-20 mb-4">
        {article.title}
      </h1>
      <span className=" text-xs text-neutral-700">{article.pubDate}</span>
      <img
        alt={article.title}
        src={article.enclosure.link}
        className=" max-h-32 min-h-32 mb-4 rounded"
      />
      {/* A decommenter en cas de rajout de bouton */}
      {/* <div className=" flex  justify-end">
        <Link href={article.url} target="_blank">
          <span className="text-neutral-400">Voir plus...</span>
        </Link>
      </div> */}
    </Link>
  );
};

export default Card;
