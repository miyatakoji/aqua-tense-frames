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
      <Button action="/prepare/create">Create room</Button>,
      <Button action="/prepare/join">Join room</Button>,
      <Button.Link href="https://google.com">(WIP)Battle log</Button.Link>,
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
        <FrameWithText title="Waiting Opponent's... (roomid:223932) please push [check] to check opponent's status" />
      ) : (
        <FrameWithText title="Please enter room number" />
      ),
    intents: [
      action === "join" && <TextInput placeholder="Enter room id here" />,
      action === "join" && <Button action="/battleturnoff">Join room</Button>,
      action === "create" && <Button.Reset>Delete room</Button.Reset>,
      action === "create" && <Button action="/battleturnon">check</Button>,
    ],
  });
});

app.frame("/battleturnon", (c) => {
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

  if (buttonValue === "off") {
    return c.res({
      action: "/battleturnoff",
      image: <FrameWithText title="off" />,
    });
  }

  // const imagestr =
  //   buttonValue === "turnon" ? (
  //     <FrameWithText title="pouring coin" />
  //   ) : (
  //     <FrameWithText title="Error!!" />
  //   );

  // const buttonstr =
  //   buttonValue === "turnon" ? (
  //     <Button value="off">Turn off!!</Button>
  //   ) : (
  //     <Button value="【Your turn】Turn on stream!!" />
  //   );
  return c.res({
    image: <FrameWithText title="【Your turn】Turn on Stream!!" />,
    intents: [<Button action="/battlestreaming">Turn on Stream</Button>],
  });
});

app.frame("/battlestreaming", (c) => {
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

  return c.res({
    image: <FrameWithText title="pouring coin!!!" />,
    intents: [<Button action="/readyforwin">Turn off Stream</Button>],
  });
});

app.frame("/readyforwin", (c) => {
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

  return c.res({
    image: <FrameWithText title="Opponent's is pouring coin..." />,
    intents: [<Button action="/result">Check</Button>],
  });
});

app.frame("/battleturnoff", (c) => {
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

  return c.res({
    image: (
      <FrameWithText title="【Opponent's turn】Opponent's is pouring coin..." />
    ),
    intents: [<Button action="/battleturnon">check</Button>],
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

  const { player } = req.param();
  console.log(player);

  return c.res({
    image:
      player === "guest" ? (
        <FrameWithText title="【Opponent's turn】Opponent's is pouring coin..." />
      ) : (
        <FrameWithText title="【Your turn】Turn on stream!!" />
      ),
    intents: [<Button action="/result">Turn on Stream</Button>],
  });
});

app.frame("/result", (c) => {
  return c.res({
    image: (
      <FrameWithText title="【You win!】 Water spilled while the opponent was pouring coins! You got $100 token" />
    ),
    intents: [
      <Button.Reset>Back to title</Button.Reset>,
      <Button.Link href="https://google.com">Share!</Button.Link>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
