"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { FaGoogle, FaInstagram as Instagram } from "react-icons/fa";
import type { Locale } from "@/i18n/config";

const travelers = [
  {
    name: "Diana Lucia Duque Guevara",
    text: "Nos sentimos muy bien atendidos por la empresa Evertrip. Su puntualidad, cortesía y buen estado de limpieza y confort de los carros nos dio seguridad y comodidad en nuestro viaje. Lo recomendamos 10/10. Gracias Evertrip.",
  },
  {
    name: "Juana Maria Romero",
    text: "Excelente servicio! Ever muy querido, muy amable y el carro en perfecto estado. Muy buen conductor, 100% recomendado para sus trayectos!!",
  },
  {
    name: "Luz Galvan",
    text: "Excelente servicio, sin duda la mejor opción para viajar cómodos y seguros.",
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
              sizes="(max-width: 700px) 100vw, 60vw"
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
              sizes="(max-width: 700px) 100vw, 60vw"
            />
          )}
        </a>
        <div className="journal-caption">
          <Instagram size={25} />
          <p>
            {es
              ? "Un pedacito\nde nuestro Caribe."
              : "A little piece\nof our Caribbean."}
          </p>
          <a
            href={
              post?.permalink ||
              "https://www.instagram.com/evertripviajesytours/"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            @evertripviajesytours
            <ArrowUpRight size={17} />
          </a>
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
