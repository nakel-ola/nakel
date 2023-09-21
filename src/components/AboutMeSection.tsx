/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Element } from "react-scroll";

type Props = {
  about: AboutResponse;
};

export const AboutMeSection = (props: Props) => {
  const { about } = props;
  return (
    <Element
      name="about"
      className="pt-16 flex flex-col items-center justify-center px-5 lg:px-10"
    >
      <div className="py-10 w-full">
        <h2 className="text-3xl lg:text-5xl font-bold text-white text-center my-3">
          Why{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Hire
          </span>{" "}
          Me <br />
          For Your{" "}
          <span className="text-primary drop-shadow-[3px_3px_0px_black] translate-x-[3px] translate-y-[3px] rotate-6">
            Next Project
          </span>
        </h2>
      </div>

      <div className="flex">
        <div className="w-[288px] h-[356px] shrink-0 bg-primary rounded-3xl overflow-hidden hidden lg:block">
          <img
            src="/1695293516052-removebg.webp"
            alt=""
            className="h-full w-full object-cover translate-y-[10%]"
          />
        </div>

        <div className="max-w-md mx-5 lg:mx-10">
          <h2 className="text-primary text-2xl lg:text-4xl font-bold">
            Web Developer
          </h2>

          <p className="text-white mt-2">{about.bio}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 pt-20 gap-10 px-5">
        <EducationCard items={about.educations} />
        <WorkCard items={about.works} />
      </div>
    </Element>
  );
};

interface EducationCardProps {
  items: Educations[];
}

const EducationCard = (props: EducationCardProps) => {
  const { items } = props;

  return (
    <div className="">
      <p className="text-white text-3xl font-bold">Education & Certificate</p>

      <div className="pt-10">
        {items.map(
          (
            { degree, institute, endDate, location, startDate, credentialUrl },
            index
          ) => (
            <div key={index} className="flex group">
              <div className="mr-3 flex flex-col items-center">
                <div className="h-[20px] w-[20px] rounded-full bg-primary"></div>

                <div className="w-[2px] h-full bg-line-color group-hover:bg-primary"></div>
              </div>
              <div
                className={cn(
                  "-mt-1",
                  index !== items.length - 1 ? "pb-10" : ""
                )}
              >
                {credentialUrl ? (
                  <Link href={credentialUrl} target="_blank" rel="noreferrer">
                    <h2 className="group-hover:underline text-xl text-primary font-bold">
                      {degree}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="text-xl text-primary font-bold">{degree}</h2>
                )}

                <div className="h-[40px] min-w-[100px] w-fit bg-card-color border border-line-color rounded-md flex items-center justify-center px-5 my-2">
                  <p className="text-white text-center">
                    {[startDate, endDate]
                      .filter((value) => value !== undefined && value !== null)
                      .join(" - ")}
                  </p>
                </div>

                {institute ? (
                  <p className="text-white py-2">{institute}</p>
                ) : null}

                {location ? (
                  <p className="text-white py-2">{location}</p>
                ) : null}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface WorkCardProps {
  items: Works[];
}

const WorkCard = (props: WorkCardProps) => {
  const { items } = props;
  return (
    <div className="">
      <p className="text-white text-3xl font-bold">
        Project Experience & Work Experience
      </p>

      <div className="pt-10">
        {items.map(
          (
            { bullets, company, description, endDate, startDate, title },
            index
          ) => (
            <div key={index} className="flex group">
              <div className="mr-3 flex flex-col items-center">
                <div className="h-[20px] w-[20px] rounded-full bg-primary"></div>

                <div className="w-[2px] h-full bg-line-color group-hover:bg-primary"></div>
              </div>

              <div
                className={cn(
                  "-mt-1",
                  index !== items.length - 1 ? "pb-10" : ""
                )}
              >
                <h2 className="text-xl text-primary font-bold">{title}</h2>

                <div className="h-[40px] min-w-[100px] w-fit bg-card-color border border-line-color rounded-md flex items-center justify-center px-5 my-2">
                  <p className="text-white text-center">
                    {startDate} - {endDate}
                  </p>
                </div>

                {company ? <p className="text-white py-2">{company}</p> : null}
                {description ? (
                  <p className="text-white py-2">{description}</p>
                ) : null}

                <div className={cn("pt-2 ")}>
                  {bullets.map((bullet, index) => (
                    <div key={index} className="flex py-2 pl-2">
                      <div className="h-[8px] w-[8px] bg-white rounded-full mr-3 shrink-0 mt-2"></div>

                      <p className="text-white">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
