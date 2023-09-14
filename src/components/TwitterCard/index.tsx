import React, { useState } from "react";
import "./index.css";
import { Button, Space, notification } from "antd";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backendIDL } from "../../dids/backend.did";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Result as FuncResult,
  Error as canisterFuncError,
} from "../../dids/service";
import avatarPNG from "../../assets/avatar.png";
import InfoCard from "../Basic/InfoCard";
import axios from "axios";
import anime from "animejs/lib/anime.es.js";
import { useIdentity } from "../../context/IdentityContext";
import { act } from "react-dom/test-utils";

interface TwitterCardProps {
  handleSetReloadKissRanking: () => void;
  handleSetReloadKickRanking: () => void;
}

const CANISTER_ID = "ybqqu-5qaaa-aaaan-qeaua-cai";
export interface UserTwitterInfo {
  username: string;
  profilePicUrl: string;
}

export async function fetchUserTwitterInfo(
  twitterHandle: string
): Promise<UserTwitterInfo | null> {
  const options = {
    method: "GET",
    url: "https://twitter154.p.rapidapi.com/user/details",
    params: {
      username: twitterHandle,
    },
    headers: {
      "X-RapidAPI-Key": "502f2f954emsh346c4bd06514a49p1a446djsnb7d1dd389a43",
      "X-RapidAPI-Host": "twitter154.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    const userTwitterInfo: UserTwitterInfo = {
      username: response.data.username,
      profilePicUrl: response.data.profile_pic_url,
    };
    console.log("fetchUserTwitterInfo : ", response.data);
    return userTwitterInfo;
  } catch (error) {
    console.error("fetchUserTwitterInfo : ", error);
    return null;
  }
}

async function getUserTwitterPicURL(name: string, actor: any) {

  const result = (await actor.getUserTwitterPicURL(name)) as [string];
  if (result.length > 0) {
    return result[0];
  } else {
    return avatarPNG;
  }
}

const TwitterCard: React.FC<TwitterCardProps> = ({
  handleSetReloadKissRanking,
  handleSetReloadKickRanking,
}) => {
  const [twitterHandle, setTwitterHandle] = useState("");
  const [kickCount, setKickCount] = useState(0); // 初始化 kickCount
  const [kissCount, setKissCount] = useState(0); // 初始化 kissCount
  const [importSuccess, setImportSuccess] = useState(false); // 新增状态来标志是否成功导入
  const [userProfilePicURL, setUserProfilePicURL] = useState<string | null>(
    null
  );
  const { identity } = useIdentity();
  // console.log('twitter card identity : ', identity);

  const getIdentityActor = () => {
    if(identity != null) {
      const actor = Actor.createActor(backendIDL, {
        agent: new HttpAgent({
          host: "https://ic0.app",
          identity: identity,
        }),
        canisterId: CANISTER_ID,
      });
      return actor;
    } else {
      toast.error('please Login !');
      return null;
    };
  };

  const getNoIdentiyActor = () => {
    return Actor.createActor(backendIDL, {
      agent: new HttpAgent({
        host: "https://ic0.app",
      }),
      canisterId: CANISTER_ID,
    })
  };

  const handleTwitterHandleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTwitterHandle(e.target.value);
  };

  const queryTheHandleCount = async () => {
    if (twitterHandle == "") return;
    const noIdentityActor = getNoIdentiyActor();
    const kickResult = await noIdentityActor.getKickByHandle(twitterHandle);
    const kissResult = await noIdentityActor.getKissByHandle(twitterHandle);
    console.log("getKickByHandle result : ", kickResult);
    console.log("getKissByHandle result : ", kissResult);
    setKickCount(Number(kickResult));
    setKissCount(Number(kissResult));
  };

  const handleImportClick = async () => {
    if (twitterHandle == "") {
      toast.warning("Input empty twitter handle !");
      return;
    }
    toast.info("Importing Twitter Handle !");
    // 查询是否已经导入
    const noIdentityActor = getNoIdentiyActor();
    const isCreatedResult = await noIdentityActor.isCreated(twitterHandle);
    // console.log('isCreatedResult : ', isCreatedResult);

    queryTheHandleCount(); // 获取当前的kick和kiss值

    // 是否已经有用户的Twitter MetaData
    const isHaveTwitterMetaData = await noIdentityActor.isHaveTwitterInfo(twitterHandle);

    // 没有则从api 抓取 Twitter MetaData
    if (!isHaveTwitterMetaData) {
      const fetchUserTwitterInfoResult = await fetchUserTwitterInfo(
        twitterHandle
      );
      if (fetchUserTwitterInfoResult != null) {
        const updateUserTwitterInfoResult = (await noIdentityActor.updateUserTwitterInfo(
          fetchUserTwitterInfoResult.username,
          fetchUserTwitterInfoResult.profilePicUrl
        )) as FuncResult;
        setUserProfilePicURL(fetchUserTwitterInfoResult.profilePicUrl);
      } else {
        toast.error(
          "Invalid Twitter Handle Or Get User Twitter MetaData Error"
        );
      }
    } else {

      setUserProfilePicURL(await getUserTwitterPicURL(twitterHandle, noIdentityActor));
    }

    if (isCreatedResult) {
      setImportSuccess(true);
      queryTheHandleCount();
      // toast.info('Have imported twitter handle !');
      return;
    } else {
      // 导入handle
      // toast.info('Importing Twitter Handle !');
      const createResult = (await noIdentityActor.create(twitterHandle)) as FuncResult;
      console.log("createResult : ", createResult);
      if ("ok" in createResult) {
        setImportSuccess(true);
        queryTheHandleCount();
        toast.success("Import Twitter Handle Success !");
        return;
      } else {
        setImportSuccess(false);
        toast.error(Object.keys(createResult.err)[0]);
        console.log(Object.keys(createResult.err)[0]);
      }
    }
  };

  const onKissFace = async () => {
    const identityActor = getIdentityActor();
    if(identityActor == null) return;

    toast.info("Kiss ing !");
    console.log('kiss identity : ', identity?.getPrincipal().toString());

    const kissResult = (await identityActor.kiss(twitterHandle)) as FuncResult;
    console.log("Kiss : ", kissResult);
    if ("ok" in kissResult) {
      queryTheHandleCount();
      toast.success("Kiss Success !");
      handleSetReloadKissRanking();
    } else {
      toast.error(Object.keys(kissResult.err)[0]);
    }
  };

  const onKickAss = async () => {
    animateCSS(".avatar", "hinge");

    const identityActor = getIdentityActor();
    if(identityActor == null) return;

    toast.info("Kick ing !");
    console.log('kick identity : ', identity?.getPrincipal().toString());

    const kickResult = (await identityActor.kick(twitterHandle)) as FuncResult;
    console.log("Kick : ", kickResult);
    if ("ok" in kickResult) {
      queryTheHandleCount();
      toast.success("Kick Success !");
      handleSetReloadKickRanking();
    } else {
      toast.error(Object.keys(kickResult.err)[0]);
    }
  };

  const animateCSS = (element: any, animation: any, prefix = "animate__") =>
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = document.querySelector(element);

      node.classList.add(`${prefix}animated`, animationName);

      function handleAnimationEnd(event: { stopPropagation: () => void }) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve("Animation ended");
      }

      node.addEventListener("animationend", handleAnimationEnd, { once: true });
    });

  // const _revealVert = (bottomY, easing, delay) => ({
  //   translateY: [bottomY, 0],
  //   opacity: [0, 1],
  //   easing: easing,
  //   delay: anime.stagger(delay)
  // });

  //chick icon animation
  let chickJumpAnimation;

  const jumpKeyframes = {
    scaleY: [
      { value: 0.9, duration: 170 },
      { value: 1, duration: 170, delay: 120 },
    ],
    translateY: [
      { value: -20, duration: 170, delay: 170 },
      { value: 0, duration: 170, delay: 220 },
    ],
  };

  const targetElement = ".avatar";
  const chickIconAnimation = anime({
    targets: `${targetElement}`,
    // ..._revealVert(25, "easeOutElastic", 100),

    complete: function () {
      const chick = document.querySelector(targetElement) as HTMLElement;
      if (chick !== null && chick.style !== null) {
        chick.style.transformOrigin = "center bottom";
      }
      chickJumpAnimation = anime({
        targets: `${targetElement}`,
        ...jumpKeyframes,
        loop: true,
        easing: "linear",
      });
    },
  });

  return (
    <div className="container">
      <div className="twitterCard">
        <div className="title">Import Twitter Handle</div>
        <div className="content">
          <div className="search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              className="input "
              type="text"
              value={twitterHandle}
              placeholder="elonmusk"
              onChange={handleTwitterHandleChange}
            />
          </div>
          <div className="meta">
            <img className="avatar" src={avatarPNG} alt="avatar" />
            <button className="importButton" onClick={handleImportClick}>
              <div className="title">Import</div>
            </button>
          </div>
        </div>
        <div className="button">
          <button className="kick" onClick={onKickAss}>
            <div className="title shake">KICK ASS</div>
          </button>
          <button className="kiss" onClick={onKissFace}>
            <div className="title shake-chunk">KISS FACE</div>
          </button>
        </div>
      </div>
      {importSuccess && (
        <div className="recently">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g opacity="0.16">
              <circle cx="10" cy="10" r="8" stroke="white" stroke-width="4" />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="black"
                stroke-opacity="0.56"
                stroke-width="4"
              />
            </g>
            <path
              d="M2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2"
              stroke="white"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2"
              stroke="black"
              stroke-opacity="0.56"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
          <div className="title">Recently</div>
        </div>
      )}

      {importSuccess && (
        <div className="kiss-kick-container">
          <div className="box">
            <InfoCard
              avatarUrl={userProfilePicURL ? userProfilePicURL : avatarPNG}
              name={twitterHandle}
            />
          </div>
          <div className="count">Get {kissCount}</div>
          <div className="kiss">
            <div className="title">kiss</div>
          </div>
        </div>
      )}
      {importSuccess && (
        <div className="kiss-kick-container">
          <div className="box">
            <InfoCard
              avatarUrl={userProfilePicURL ? userProfilePicURL : avatarPNG}
              name={twitterHandle}
            />
          </div>
          <div className="count">Get {kickCount}</div>
          <div className="kick">
            <div className="title">KICK</div>
          </div>
        </div>
      )}
      {/* {importSuccess && (
        <div className="kiss-kick-container">
          <div className="box">
            <InfoCard
              avatarUrl={
                ""
                // userTwitterInfo ? userTwitterInfo.profilePicUrl : avatarPNG
              }
              name={twitterHandle}
            />
          </div>
          <div className="count">Get {kickCount}</div>
          <div className="kick">
            <div className="title">KICK</div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TwitterCard;
