import React, { useState, useCallback } from "react";
import { apiOrigin, siteOrigin } from "./config";

export function CreatePost({ token, username, signOut }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [postId, setPostId] = useState(null);
  const onTextChange = useCallback(e => setText(e.target.value));

  const canSubmit =
    !submitting && text.replace(/^\s+/, "").replace(/\s+$/, "") !== "";

  const submit = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setPostId(null);

    fetch(`${apiOrigin}/v1/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        post: { body: text },
        meta: { feeds: [username] }
      })
    })
      .then(r => r.json())
      .then(resp => {
        if (resp.err) {
          throw new Error(resp.err);
        }
        setSubmitting(false);
        setText("");
        setPostId(resp.posts.id);
      })
      .catch(err => {
        setSubmitting(false);
        setError(err.message);
      });
  });

  return (
    <>
      <p>
        Hello, <strong>{username}</strong>!{" "}
        <button onClick={signOut}>Sign Out</button>
      </p>
      <p>What do you want to say to world?</p>
      <p>
        <textarea value={text} onChange={onTextChange} />
      </p>
      <p>
        <button disabled={!canSubmit} onClick={submit}>
          Submit to your feed!
        </button>
      </p>
      {error && <p className="error">Can not create post: {error}</p>}
      {postId && (
        <p className="success">
          Success!{" "}
          <a href={`${siteOrigin}/${username}/${postId}`} target="_blank">
            Here is your brand new post!
          </a>
        </p>
      )}
    </>
  );
}
