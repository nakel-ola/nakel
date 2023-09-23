import emailjs from "@emailjs/browser";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useRef,
  useState,
} from "react";
import { Element } from "react-scroll";
import { MoonLoader } from "react-spinners";
import { RippleCard } from "./RippleCard";
type Props = {};

export const ContactSection = (props: Props) => {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const disabled = (): boolean => {
    if (!formRef.current) return false;
    const formData = new FormData(formRef.current);

    const values: boolean[] = [];
    formData.forEach((value) => {
      if (!value) return values.push(false);
      else values.push(true);
    });

    return values.every((value) => value === true) ? false : true;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    const v = disabled();

    if (v) return;

    setLoading(true);

    emailjs
      .sendForm(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.EMAILJS_PUBLIC_KEY!
      )
      .then(
        (result) => {
          setLoading(false);
          formRef.current?.reset();
          setIsSubmitted(true);
        },
        (error) => {
          setLoading(false);
        }
      );
  };

  if (router.pathname === "/admin/[[...index]]") return <Fragment></Fragment>;
  return (
    <Element
      name="contact"
      className="my-8 lg:my-16 px-5 lg:px-10 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center pb-10">
        <h2 className="text-3xl lg:text-5xl font-bold text-white text-center my-3">
          Get In{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Touch
          </span>
        </h2>

        <p className=" text-xl lg:text-2xl text-center">I will truly turn your idea, vision into reality</p>
      </div>

      <div className="w-full lg:w-[50%] bg-card-color border-[1px] border-line-color rounded-3xl px-5 lg:px-10 py-10">
        {loading && (
          <div className="w-full grid place-items-center py-4">
            <MoonLoader />
          </div>
        )}

        {isSubmitted && (
          <div className="w-full grid place-items-center py-4">
            <p className="text-5xl text-center">
              Thank you for getting in touch!
            </p>
          </div>
        )}

        {!loading && !isSubmitted ? (
          <form onSubmit={handleSubmit} className="w-full space-y-5 ">
            <div className="">
              <label htmlFor="" className="text-white text-xl">
                Name
              </label>

              <div className="w-full bg-[#343639] h-[50px] rounded-lg flex mt-1">
                <input
                  type="text"
                  className="bg-transparent text-lg border-0 w-full outline-0 text-white px-2 my-auto"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="text-white">
              <label htmlFor="" className="text-white text-xl">
                Email
              </label>

              <div className="w-full bg-[#343639] h-[50px] rounded-lg flex mt-1">
                <input
                  type="email"
                  className="bg-transparent text-lg border-0 w-full outline-0 text-white px-2 my-auto"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="">
              <label htmlFor="" className="text-white text-xl">
                About Project
              </label>

              <div className="w-full bg-[#343639] min-h-[50px] rounded-lg flex mt-2">
                <textarea
                  rows={4}
                  className="bg-transparent text-lg border-0 w-full outline-0 text-white px-2 my-auto resize-none"
                  autoComplete="text"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="">
              <RippleCard
                type="submit"
                className="bg-white hover:bg-primary text-black hover:text-white w-full text-lg font-medium flex items-center justify-center py-2 rounded-lg hover:scale-105 active:scale-95 mt-10"
              >
                Send Message
              </RippleCard>
            </div>
          </form>
        ) : null}
      </div>
    </Element>
  );
};
