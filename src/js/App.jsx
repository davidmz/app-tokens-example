import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TokenRequest } from "./TokenRequest";
import { async } from "q";
import { apiOrigin } from "./config";
import { CreatePost } from "./CreatePost";

const storageKey = "freefeed-token";

export function App() {
  // Load previuosly saved token for the first time
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));
  const [username, setUsername] = useState(null);

  const signOut = useCallback(() => setToken(null));

  // Token persistence
  useEffect(() => {
    token
      ? localStorage.setItem(storageKey, token)
      : localStorage.removeItem(storageKey);
  }, [token]);

  // If we have token but no username then we need to load user info
  const loadingUserInfo = token && !username;
  useEffect(() => {
    if (!loadingUserInfo) {
      return;
    }

    fetch(`${apiOrigin}/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(resp => {
        if (resp.err) {
          throw new Error(resp.err);
        }
        setUsername(resp.users.username);
      })
      .catch(err => {
        console.warn(`Error requesting user info: ${err}`);
        signOut();
      });
  }, [loadingUserInfo]);

  if (loadingUserInfo) {
    return <p>Loading...</p>;
  }

  if (!token) {
    // Anonymous, requesting token
    return <TokenRequest setToken={setToken} />;
  }

  // User is authorized, return the create post form
  return <CreatePost token={token} username={username} signOut={signOut} />;
}
