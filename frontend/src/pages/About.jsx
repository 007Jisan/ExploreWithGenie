import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111f36] mb-4">
            About GENNIE<span className="text-[#00b4d8]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#00b4d8] font-semibold tracking-wide">
            Your AI-Powered Travel Companion for Bangladesh
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* Mission Section */}
          <section className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border-t-4 border-[#111f36] hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold text-[#111f36] mb-6 inline-block border-b-4 border-[#00b4d8] pb-2">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              ExploreWithGenie was built with a single goal: to help you discover the hidden gems
              of Bangladesh effortlessly. We believe that traveling should be about the experience,
              not the hassle of planning. By combining smart AI technology with local insights, we make 
              every journey memorable and seamless.
            </p>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-3xl font-bold text-[#111f36] mb-8 text-center">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-lg hover:border-[#00b4d8] transition-all duration-300 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
                <h3 className="text-xl font-bold text-[#111f36] mb-3">Smart Routing</h3>
                <p className="text-gray-600">
                  Our AI analyzes multiple factors to provide you with the most efficient and scenic routes for your journey.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-lg hover:border-[#00b4d8] transition-all duration-300 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
                <h3 className="text-xl font-bold text-[#111f36] mb-3">Interactive Maps</h3>
                <p className="text-gray-600">
                  Navigate seamlessly with custom interactive maps designed specifically for exploring local destinations.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-lg hover:border-[#00b4d8] transition-all duration-300 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🇧🇩</div>
                <h3 className="text-xl font-bold text-[#111f36] mb-3">Hidden Gems</h3>
                <p className="text-gray-600">
                  Go beyond the usual tourist spots. Discover authentic local experiences and places off the beaten path.
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;