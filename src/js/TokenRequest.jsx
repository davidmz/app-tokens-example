import React, { useRef, useCallback } from "react";
import { siteOrigin } from "./config";

export function TokenRequest({ setToken }) {
  const input = useRef();
  const btnClick = useCallback(() => {
    const token = input.current && input.current.value;
    if (!token) {
      alert("Please enter token");
      return;
    }

    setToken(token);
  }, [setToken]);

  return (
    <>
      <p>Please enter you access token to continue:</p>
      <p>
        <input ref={input} type="text" />{" "}
        <button onClick={btnClick}>Save</button> (
        <a
          href={`${siteOrigin}/settings/app-tokens/create?title=Example%20app%20token&scopes=manage-posts`}
          target="_blank"
        >
          generate token
        </a>
        )
      </p>
      <p>
        This token will allow the application to create a post on your behalf.
      </p>
    </>
  );
}
