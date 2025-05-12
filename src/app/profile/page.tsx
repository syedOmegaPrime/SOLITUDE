"use client";

import React, { Suspense } from "react";
import ProfileContent from "./ProfileContent";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
