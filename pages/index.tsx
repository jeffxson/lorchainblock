import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import SearchComponent from "../components/header";
import { BsFillPersonFill, BsFillPeopleFill } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { MdCancelPresentation } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import ReactPaginate from "react-paginate";

interface UserProvider {
  following: string;
  avatar_url: string;
  name: string;
  login: string;
  html_url: string;
  followers: string;
  public_repos: string;
}
interface RepoProvider {
  [x: string]: any;
  following: string;
  avatar_url: string;
}

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<UserProvider>([] as any);
  const [repo, setRepo] = useState<RepoProvider>([] as any);
  const [errors, setError] = useState(false);
  const [intiState, setIntiState] = useState(true);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .get(`https://api.github.com/users/${search}`)
      .then((res: any) => {
        if (res.status === 200) {
          setIntiState(false);
          setError(false);
          setUser(res.data);

          axios
            .get(`https://api.github.com/users/${search}/repos?per_page=1000`)
            .then((res: any) => {
              setRepo(res.data);
            })
            .catch((err: any) => {
              console.log(err);
              setIntiState(false);
            });
        }
      })
      .catch((err: any) => {
        setError(true);
      });
  };

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 4;
  console.log(currentItems);
  const endOffset = itemOffset + itemsPerPage;
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(repo.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(repo.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, repo]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % repo.length;

    setItemOffset(newOffset);
  };

  return (
    <div className="bg-[#E5E5E5] ">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchComponent
        handleSubmit={handleSubmit}
        onChange={(e: any) => setSearch(e.target.value)}
      />
      {errors ? (
        <div
          className="grid h-screen place-items-center"
          style={{ marginTop: "-60px", marginBottom: "-50px", color: "gray" }}
        >
          <div className="text-center text-2xl">
            <AiOutlineUser
              size="80px"
              style={{ marginLeft: "40px", marginBottom: "30px" }}
            />
            User Not Found
          </div>
        </div>
      ) : user.avatar_url ? (
        <>
          {" "}
          {repo.length > 0 ? (
            <div>
              <div className="flex ... p-4 h-screen	">
                <div className="flex-initial w-3/12   ">
                  <img
                    src={user.avatar_url}
                    alt="avater"
                    className="rounded-full w-72"
                  />
                  <p className="text-2xl mt-4">
                    <b> {user.name}</b>
                  </p>
                  <a
                    href={user.html_url}
                    className="text-blue-600"
                    target="_blank"
                  >
                    {user.login}
                  </a>
                  <div className="flex justify-between mt-5 w-11/12">
                    <div className="flex ...">
                      <BsFillPersonFill color="gray" />

                      <p style={{ marginTop: "-5px", marginLeft: "10px" }}>
                        {user.followers} followers
                      </p>
                    </div>
                    <div className="flex ...">
                      <BsFillPeopleFill color="gray" />
                      <p style={{ marginTop: "-5px", marginLeft: "10px" }}>
                        {user.following} following
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex-initial w-9/12 pl-9  ">
                  <p className="text-3xl mb-9">
                    <b> Repositories</b> ({user.public_repos})
                  </p>
                  {currentItems.map((data: any, i: any) => (
                    <div key={i} className="rounded w-full bg-[white] p-4 mb-4">
                      <a
                        href={data.html_url}
                        className="text-blue-600 text-2xl"
                        target="_blank"
                      >
                        {data.name}
                      </a>
                      <p className="mt-2">{data.description} </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="float-right mr-9 flex"
                style={{ marginTop: "-100px" }}
              >
                <p className="text-sm mt-2 mr-5">
                  {`${itemOffset}-${itemOffset + 4} of ${
                    user.public_repos
                  } items`}
                </p>

                <ReactPaginate
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={pageCount}
                  previousLabel="<"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  containerClassName="pagination"
                  activeClassName="active"
                />
              </div>
            </div>
          ) : (
            <div
              className="grid h-screen place-items-center"
              style={{
                marginTop: "-60px",
                marginBottom: "-50px",
                color: "gray",
              }}
            >
              <div className="text-center text-2xl">
                <MdCancelPresentation
                  size="80px"
                  style={{ marginLeft: "70px", marginBottom: "30px" }}
                />
                Repository list is empty
              </div>
            </div>
          )}{" "}
        </>
      ) : (
        ""
      )}

      {intiState ? (
        <div
          className="grid h-screen place-items-center"
          style={{ marginTop: "-60px", marginBottom: "-50px", color: "gray" }}
        >
          <div className="text-center text-2xl">
            <FiSearch
              size="80px"
              style={{ marginLeft: "70px", marginBottom: "30px" }}
            />
            Start with searching<br></br>a GitHub user
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
