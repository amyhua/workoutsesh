import { CheckCircleIcon, CheckIcon, ChevronLeftIcon, PencilIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Clamped from "../../components/Clamped";
import Layout from "../../components/Layout";
import Logo from "../../components/Logo";
import WorkoutForm, { FormMode } from "../../components/WorkoutForm";

function CreateWorkout() {
  return (
    <Layout title="Create Workout | WorkoutSesh">
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white h-[90px]">
        <div className="max-w-4xl mx-auto h-[90px]">
          <Logo size={180} className="my-0" />
        </div>
      </nav>
      <WorkoutForm mode={FormMode.Create} />
    </Layout>
  )
}

export default CreateWorkout
