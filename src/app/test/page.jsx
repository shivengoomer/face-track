"use client";

import React, { useEffect, useRef } from "react";
import Video from "../components/video";
import { Particles } from "../components/particles";
export default function Test() {

  return (
    <div>
      <Particles className="absolute inset-0" quantity={600} />
      <Video />
    </div>
  );
}
