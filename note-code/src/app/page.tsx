export const dynamic = "force-dynamic";

import CodeEditor from "@/components/code-snippet";
import Image from "next/image";

export default function Home() {
	return (
		<div
			style={{
				backgroundImage: `linear-gradient(to bottom right, rgba(183, 135, 245, 1), rgba(116, 62, 228, 1))`,
			}}
		>
			<div className="bg-[url('/assets/bg.svg')] lg:bg-[url('/assets/bg2x.png')] h-screen overflow-hidden bg-top bg-contain bg-no-repeat">
				<div className="container mx-auto px-4 py-8 flex flex-col items-center">
					{/* LOGO */}
					<Image
						src="/assets/NoteCodeLogo.svg"
						alt="Logo"
						width={120}
						height={120}
					/>

					{/* HEADING */}
					<h1 className="text-[32px] font-semibold mb-2 mt-8">
						Create and Share
					</h1>
					<h1 className="text-[40px] font-bold">Your Code Easily</h1>

					{/* EDITOR */}
					<CodeEditor />
				</div>
			</div>
		</div>
	);
}
