/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

function FrameWithText({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        background: "black",
        textAlign: "center",
        padding: "30px",
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: 60,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          style={{
            fontSize: 40,
            color: "white",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Welcome to Aqua tense game!
        </div>
      </div>
    ),
    intents: [
      <Button action="/prepare/create">Create</Button>,
      <Button action="/prepare/join">Join room</Button>,
      <Button.Link href="https://google.com">Battle log</Button.Link>,
    ],
  });
});

app.frame("/prepare/:action", (c) => {
  // const { buttonValue, inputText, status } = c;

  const { buttonValue, status, deriveState, frameData, env, req, verified } = c;
  console.log({
    buttonValue,
    status,
    deriveState,
    frameData,
    env,
    req,
    verified,
  });

  const { action } = req.param();
  console.log(action);

  return c.res({
    image:
      action === "create" ? (
        <FrameWithText title="Waiting enemy... (roomid:223932)" />
      ) : (
        <FrameWithText title="Please enter room number" />
      ),
    intents: [
      <Button action="/battle">Create</Button>,
      action === "join" && <TextInput placeholder="Enter room id here" />,
      action === "join" && <Button action="/battle">Join room</Button>,
      action === "create" && <Button.Reset>Delete room</Button.Reset>,
      action === "create" && <Button action="/battle">Join room</Button>,
    ],
  });
});

app.frame("/battle/:player", (c) => {
  const { buttonValue, status, deriveState, frameData, env, req, verified } = c;
  console.log({
    buttonValue,
    status,
    deriveState,
    frameData,
    env,
    req,
    verified,
  });

  const { action } = req.param();
  console.log(action);
  return c.res({
    image: <FrameWithText title="Welcome!" />,
    intents: [
      <Button action="/battle:stream-on">Start Stream!!</Button>,
      <Button action="/battle:stream-off">Stop!!</Button>,
      <Button action={`/battle/create`}>Share!</Button>,
    ],
  });
});

app.frame("/result", (c) => {
  const { buttonValue, inputText, status } = c;

  // const { buttonValue, status, deriveState, frameData, env, req, verified } = c;
  // console.log({ status, buttonValue, env, frameData });

  // const { action } = req.param();
  // console.log(action);
  return c.res({
    image: <FrameWithText title="Welcome!" />,
    intents: [
      // <Button value="create">Create room</Button>,
      // <Button value="join">Join game with room id</Button>,
      <Button action="/prepare">Create</Button>,
      <Button action={`/battle/create`}>Share!</Button>,
      <Button.Link href="https://google.com">Google</Button.Link>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
