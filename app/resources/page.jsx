import React from "react";

export const metadata = { title: "Resources • Nirvaan" };


const resources = {
  videos: [
    {
      title: "Introduction to Mindfulness",
      description: "Learn simple techniques to stay present and reduce daily stress through mindfulness.",
      img: "/mindfullness.png",
      link: "https://youtu.be/7-1Y6IbAxdM?si=YBErduhrpzmF1mOd",
    },
    {
      title: "Mindfulness for Beginners",
      description: "A simple guide to understanding mindfulness and its benefits for mental clarity.",
      img: "apple-185399337.jpg",
      link: "https://youtu.be/7RZne_dfg84?si=WvmSKMnnuGL3dxy-",
    },
  ],
  audios: [
    {
      title: "Guided Sleep Meditation",
      description: "A soothing guided audio session to help you relax your mind and prepare for a restful sleep.",
      img: "/piano-5353974.jpg",
      src: "/Media/piano.mp3",
    },
    {
      title: "Stress Relief Meditation",
      description: "Listen to calming sounds and guided exercises to reduce anxiety and stress.",
      img: "/piano-5353974.jpg",
      src: "/Media/motivation.mp3",
    },
  ],
  articles: [
    {
      title: "5 Ways to Manage Academic Stress",
      description: "Practical tips and strategies to cope with pressure and maintain focus during exams.",
      img: "/5ways.png",
      link: "https://www.prospects.ac.uk/applying-for-university/university-life/5-ways-to-manage-student-stress",
    },
    {
      title: "Mindfulness in Daily Life",
      description: "Learn how small mindfulness practices can positively impact your mental health.",
      img: "/mind.png",
      link: "https://www.mindful.org/take-a-mindful-moment-5-simple-practices-for-daily-life/",
    },
  ],
};

export default function ResourcesPage() {
  return (
    <>
    <main className="min-h-screen font-poppins px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-black">Mental Health Resources</h1>
        <p className="text-gray-600 mt-2">Explore videos, audios, and articles curated for your well-being.</p>
      </header>

     
      <section className="mb-12">
        <h2 className="text-3xl  text-blue-900 font-semibold mb-6">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.videos.map((v, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
              <img src={v.img} alt={v.title} className="w-full h-52 object-cover" />
              <div className="p-5">
                <span className="bg-[#a0642b] text-white text-xs font-semibold px-3 py-1 rounded-full">Video</span>
                <h3 className="text-xl text-blue-900 font-bold mt-3 mb-2">{v.title}</h3>
                <p className="text-gray-600 mb-4">{v.description}</p>
                <a
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#71471f] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#3f2710] transition"
                >
                  Watch Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <section className="mb-12">
        <h2 className="text-3xl text-blue-900 font-semibold mb-6">Audios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.audios.map((a, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
              <img src={a.img} alt={a.title} className="w-full h-52 object-cover" />
              <div className="p-5">
                <span className="bg-[#a0642b] text-white text-xs font-semibold px-3 py-1 rounded-full">Audio</span>
                <h3 className="text-xl text-blue-900 font-bold mt-3 mb-2">{a.title}</h3>
                <p className="text-gray-600 mb-4">{a.description}</p>
                <audio controls className="w-full rounded-md">
                  <source src={a.src} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="mb-12">
        <h2 className="text-3xl text-blue-900 font-semibold mb-6">Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.articles.map((art, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
              <img src={art.img} alt={art.title} className="w-full h-52 object-cover" />
              <div className="p-5">
                <span className="bg-[#a0642b] text-white text-xs font-semibold px-3 py-1 rounded-full">Article</span>
                <h3 className="text-xl text-blue-900 font-bold mt-3 mb-2">{art.title}</h3>
                <p className="text-gray-600 mb-4">{art.description}</p>
                <a
                  href={art.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#71471f] text-white px-5 py-2 rounded-full font-semibold hover:bg-[#3f2710] transition"
                >
                  Read Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
      

    </main>
     
      <section className="bg-[#fce6d8] text-black py-16 text-center">
        <div className="container rounded-2xl mx-auto px-5 max-w-6xl">
          <h3 className="text-4xl font-bold mb-5">
            Take the first step towards mental clarity.
          </h3>
          <p className="text-lg mb-8">
            Discover curated resources, guided exercises, and expert support to nurture your well-being.
          </p>
          <a href="/chatbot" className="inline-block bg-[#71471f] hover:bg-[#3f2710] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:-translate-y-1">
            Explore the Chatbot
          </a>
        </div>
      </section>
      </>
  );
}


