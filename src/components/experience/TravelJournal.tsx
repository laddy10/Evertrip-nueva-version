"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { FaGoogle, FaInstagram as Instagram } from "react-icons/fa";
import type { Locale } from "@/i18n/config";

const travelers = [
  {
    name: "Luz Galvan",
    text: "Excelente servicio, sin duda la mejor opción para viajar cómodos y seguros.",
  },
  {
    name: "LORENA BERMUDEZ AYALA",
    text: "Confiable y seguro. Excelente servicio 😊 Súper recomendado!!!...",
  },
  {
    name: "Juana Maria Romero",
    text: "Excelente servicio! Ever muy querido, muy amable y el carro en perfecto estado. Muy buen conductor, 100% recomendado para sus trayectos!!",
  },
];
type Post = {
  id: string;
  permalink: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  sizes?: { medium?: { mediaUrl: string } };
};

export default function TravelJournal({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const [review, setReview] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postIndex, setPostIndex] = useState(0);
  const journal = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!journal.current) return;
    const controller = new AbortController();
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        fetch("https://feeds.behold.so/jnOqnG9EkhouJG9irFw7", {
          signal: controller.signal,
        })
          .then((response) => (response.ok ? response.json() : null))
          .then((data) => {
            if (Array.isArray(data?.posts) && !controller.signal.aborted)
              setPosts(data.posts.slice(0, 5));
          })
          .catch(() => {
            /* Real local journey photograph remains available offline. */
          });
      },
      { rootMargin: "250px" },
    );
    observer.observe(journal.current);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, []);
  const post = posts[postIndex];
  const postImage =
    post?.sizes?.medium?.mediaUrl ||
    (post?.mediaType === "VIDEO" ? post.thumbnailUrl : post?.mediaUrl);
  return (
    <section className="travel-journal" aria-labelledby="journal-title">
      <div className="traveler-voice">
        <h2 id="journal-title">
          {es
            ? "El viaje, contado\npor quienes lo vivieron."
            : "The journey, told\nby those who lived it."}
        </h2>
        <div className="traveler-quote" aria-live="polite">
          <blockquote lang="es">“{travelers[review].text}”</blockquote>
          <div>
            <div className="traveler-meta">
              <span>{travelers[review].name}</span>
              <a
                className="google-reviews-link"
                href="https://www.google.com/maps/search/?api=1&query=Evertrip&query_place_id=ChIJHzbjopH19I4RBmesdbLr950"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGoogle size={13} />
                {es ? "Ver todas las reseñas en Google" : "Read all reviews on Google"}
                <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="journal-controls">
              <button
                aria-label={es ? "Testimonio anterior" : "Previous testimonial"}
                onClick={() => setReview((review + 2) % 3)}
              >
                <ArrowLeft size={18} />
              </button>
              <span>{review + 1} / 3</span>
              <button
                aria-label={es ? "Testimonio siguiente" : "Next testimonial"}
                onClick={() => setReview((review + 1) % 3)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={journal} className="journal-postcard">
        <div className="journal-media">
          <a
            className="journal-photo"
            href={
              post?.permalink || "https://www.instagram.com/evertripviajesytours/"
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              es ? "Ver el viaje en Instagram" : "See the journey on Instagram"
            }
          >
            {postImage ? (
              <Image
                src={postImage}
                alt={post.caption?.slice(0, 180) || "Evertrip Instagram"}
                fill
                unoptimized
                sizes="(max-width: 700px) 100vw, 36vw"
              />
            ) : (
              <Image
                src="/assets/lugares/real-group-transfer.jpg"
                alt={
                  es
                    ? "Viajeros y vehículo de Evertrip"
                    : "Evertrip travelers and vehicle"
                }
                fill
                sizes="(max-width: 700px) 100vw, 36vw"
              />
            )}
          </a>

          {posts.length > 1 && (
            <div className="journal-thumbnails" aria-label={es ? "Publicaciones recientes" : "Recent posts"}>
              {posts.map((item, index) => {
                const thumb =
                  item.sizes?.medium?.mediaUrl ||
                  (item.mediaType === "VIDEO" ? item.thumbnailUrl : item.mediaUrl);
                return (
                  <button
                    key={item.id}
                    className={index === postIndex ? "is-active" : ""}
                    onClick={() => setPostIndex(index)}
                    aria-label={es ? `Ver publicación ${index + 1}` : `View post ${index + 1}`}
                  >
                    {thumb && (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        unoptimized
                        sizes="64px"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="journal-caption">
          <span className="journal-kicker">
            <Instagram size={18} />
            {es ? "Síguenos en Instagram" : "Follow us on Instagram"}
          </span>

          <p>
            {es
              ? "Un pedacito\nde nuestro Caribe."
              : "A little piece\nof our Caribbean."}
          </p>

          <a
            className="journal-instagram-cta"
            href="https://www.instagram.com/evertripviajesytours/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {es ? "Explorar Instagram" : "Explore Instagram"}
            <ArrowUpRight size={17} />
          </a>

          <span className="journal-handle">@evertripviajesytours</span>

          {posts.length > 1 && (
            <div className="journal-controls">
              <button
                aria-label={es ? "Publicación anterior" : "Previous post"}
                onClick={() =>
                  setPostIndex((postIndex + posts.length - 1) % posts.length)
                }
              >
                <ArrowLeft size={18} />
              </button>
              <span>
                {postIndex + 1} / {posts.length}
              </span>
              <button
                aria-label={es ? "Publicación siguiente" : "Next post"}
                onClick={() => setPostIndex((postIndex + 1) % posts.length)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
