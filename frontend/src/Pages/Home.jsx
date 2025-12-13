import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import { requests } from "../api/TMDB";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <Row title="Netflix Originals" fetchUrl={requests.netflixOriginals} />
      <Row title="Trending Now" fetchUrl={requests.trending} />
      <Row title="Top Rated" fetchUrl={requests.topRated} />
      <Row title="Action Movies" fetchUrl={requests.action} />
    </>
  );
}
