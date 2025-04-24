import { Link } from "react-router";
import { motion } from "motion/react";
import { FaUsers, FaComment, FaHeart, FaPlus } from "react-icons/fa";
import { ArrowRight, Check, ChevronRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-dvh overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50 z-0" />

        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}>
          {/* Animated Circles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute bottom-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-pink-200/20 to-transparent rounded-full blur-3xl"
          />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10" />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}>
              <motion.span
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}>
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
                Join the fastest growing community
              </motion.span>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}>
                Connect with friends,{" "}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                    share your world
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-gray-600 max-w-lg mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}>
                FreePal connects you with the people who matter. Share stories,
                join communities, and build meaningful connections in a safe,
                supportive environment.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 sm:items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl
                           hover:shadow-lg hover:shadow-indigo-500/25 transition-all group">
                  Get Started
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-indigo-50 hover:shadow-md transition-all duration-300">
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                className="mt-8 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img
                        src={`/avatar-${i}.jpg`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/default-avatar.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">1,000+</span>{" "}
                  people joined this week
                </p>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative">
              <div className="aspect-square max-w-lg mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                  initial={{
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                  }}
                  animate={{
                    borderRadius: [
                      "30% 70% 70% 30% / 30% 30% 70% 70%",
                      "70% 30% 30% 70% / 60% 40% 60% 40%",
                      "30% 70% 70% 30% / 30% 30% 70% 70%",
                    ],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}>
                  <img
                    src="/hero-image.png"
                    alt="People connecting"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.endsWith("/default-hero.jpg")) {
                        // Prevent infinite loop if default image also fails
                        target.onerror = null;
                        return;
                      }
                      target.src = "/default-hero.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-pink-600/30 mix-blend-overlay" />
                </motion.div>

                {/* Floating UI Elements */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}>
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                    <FaHeart />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">New Connection</p>
                    <p className="text-sm font-medium">
                      Jessica liked your post
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}>
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <FaComment />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">New Message</p>
                    <p className="text-sm font-medium">5 new conversations</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white z-0" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Everything you need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                {" "}
                connect and share
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Discover the tools and features that make FreePal the perfect
              platform for building meaningful connections.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <FaPlus />,
                title: "Create & Share",
                description:
                  "Share your stories, photos, and interests with friends and communities.",
                color: "from-blue-500 to-indigo-500",
                delay: 0.1,
              },
              {
                icon: <FaUsers />,
                title: "Join Communities",
                description:
                  "Find and connect with people who share your interests and passions.",
                color: "from-indigo-500 to-purple-500",
                delay: 0.2,
              },
              {
                icon: <FaComment />,
                title: "Engage & Discuss",
                description:
                  "Participate in meaningful conversations and build connections that matter.",
                color: "from-purple-500 to-pink-500",
                delay: 0.3,
              },
              {
                icon: <FaHeart />,
                title: "Stay Connected",
                description:
                  "Create lasting connections and build your network of friends.",
                color: "from-pink-500 to-rose-500",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true, margin: "-50px" }}
                className="relative group">
                <div className="h-full p-6 sm:p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div
                    className={`w-12 h-12 mb-5 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-5">{feature.description}</p>
                  <Link
                    to={`/features/${index}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                    Learn more
                    <ChevronRight
                      size={16}
                      className="ml-1"
                    />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}>
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}>
                <h2 className="text-3xl font-bold mb-4">
                  Trusted by people
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                    {" "}
                    around the world
                  </span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Join millions of people who use FreePal to connect, share, and
                  build meaningful relationships.
                </p>
                <Link
                  to="/testimonials"
                  className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                  See all testimonials
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <div className="md:col-span-2">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    content:
                      "FreePal has completely changed how I stay connected with friends. The communities feature is incredible!",
                    author: "Ahmed J.",
                    title: "Designer",
                    delay: 0.3,
                  },
                  {
                    content:
                      "I've made more genuine connections here in 2 months than I did in years on other platforms. The interface is clean and intuitive.",
                    author: "Marco T.",
                    title: "Entrepreneur",
                    delay: 0.4,
                  },
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: testimonial.delay }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={`/avatar-${index + 1}.jpg`}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-3 gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}>
            {[
              { number: "10K+", label: "Active Users", icon: "👥", delay: 0.1 },
              { number: "500+", label: "Communities", icon: "🌐", delay: 0.2 },
              { number: "1M+", label: "Posts Created", icon: "📱", delay: 0.3 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stat.delay }}
                viewport={{ once: true }}
                className="relative">
                <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-2xl">
                  {stat.icon}
                </div>
                <div className="pt-8 px-6">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <motion.section
        className="py-24 bg-gradient-to-r from-indigo-500 to-pink-500 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}>
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern-white.svg')] bg-center" />
        </div>
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}>
              Ready to connect with your community?
            </motion.h2>
            <motion.p
              className="text-xl text-indigo-100 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}>
              Join FreePal today and start sharing your world with the people
              who matter most.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}>
              <Link
                to="/register"
                className="px-8 py-4 text-base font-medium text-indigo-700 bg-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                Get Started Now
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 text-base font-medium text-white bg-transparent border border-white rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                Learn More
              </Link>
            </motion.div>

            <motion.div
              className="mt-12 flex flex-col items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-md">
                {[
                  "Free to use",
                  "Privacy focused",
                  "No ads",
                  "Safe community",
                  "Real connections",
                  "24/7 support",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2">
                    <Check
                      size={16}
                      className="text-indigo-200"
                    />
                    <span className="text-sm text-indigo-100">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
