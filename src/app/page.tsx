import Button from "@/components/Button";

export default function Home() {
  return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-extrabold text-blue-500 mb-1">Web Chat</h1>
        <p className="mb-10">subheading</p>
        <Button>Start chat</Button>
      </div>
  );
}
