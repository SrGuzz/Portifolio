import PageTitle from "./PageTitle";
import { useEffect, useState } from "react";
import { CardWithLink } from "./CardRepository";
import { ProfileCard } from "./Card";

function Api() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/SrGuzz/repos")
      .then((response) => response.json())
      .then((data) => setRepositories(data));
  }, []);

  const [profile, setProfile] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/SrGuzz")
      .then((response) => response.json())
      .then((data) => setProfile(data));
  }, []);

  return (
    <section id="projects" className="pb-10 w-full bg-slate-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <PageTitle title="Repositories" />

        <div className="flex justify-center">
          <ProfileCard
            Name={profile.name}
            Img={profile.avatar_url}
            Url={profile.html_url}
          />
        </div>
      </div>
      {/* Scroller: vários cards lado a lado */}
      <div className="max-w-[80%] m-auto">
        <div className="carousel carousel-center w-full p-4 space-x-4 rounded-box bg-transparent">
          {repositories.map((repository) => (
            <div key={repository.id} className="carousel-item px-2 w-96 ">
              <CardWithLink
                Title={repository.name}
                Url={repository.html_url}
                Description={repository.description}
                Tags={repository.topics}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Api;
