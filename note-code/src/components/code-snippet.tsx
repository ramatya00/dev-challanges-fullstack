"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSnippet, getSnippetById } from "@/actions/sinippet-actions";
import Image from "next/image";

const DEFAULT_HTML = `<html>
  <head>
    <title>HTML Sample</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
      h1 {
        color: #cca3a3;
      }
    </style>
    <script type="text/javascript">
      alert("I am a sample... visit devChallengs.io for more projects");
    </script>
  </head>
  <body>
    <h1>Heading No.1</h1>
    <input disabled type="button" value="Click me" />
  </body>
</html>`;

export default function CodeEditor() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const snippetId = searchParams.get("id");

	const [code, setCode] = useState(DEFAULT_HTML);
	const [language, setLanguage] = useState("html");
	const [theme, setTheme] = useState("vs-dark");
	const [isShared, setIsShared] = useState(false);
	const [isModified, setIsModified] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showCopied, setShowCopied] = useState(false);

	// Load snippet if ID exists in URL
	useEffect(() => {
		if (snippetId) {
			loadSnippet(snippetId);
		}
	}, [snippetId]);

	const loadSnippet = async (id: string) => {
		setIsLoading(true);
		try {
			const result = await getSnippetById(id);

			if (result.success && result.data) {
				setCode(result.data.code);
				setLanguage(result.data.language);
				setTheme(result.data.theme);
				setIsShared(true);
			} else {
				console.error(result.error);
			}
		} catch (error) {
			console.error("Error loading snippet:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShare = async () => {
		setIsLoading(true);
		try {
			const result = await createSnippet({ code, language, theme });

			if (result.success && result.id) {
				router.push(`/?id=${result.id}`);
				setIsShared(true);
				setIsModified(false);
			} else {
				console.error(result.error);
			}
		} catch (error) {
			console.error("Error sharing snippet:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCodeChange = (value: string | undefined) => {
		setCode(value || "");
		if (isShared) {
			setIsModified(true);
		}
	};

	const handleCopyUrl = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy:", error);
		}
	};

	const isShareDisabled = isShared && !isModified;

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Editor Container */}
			<div className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden">
				{/* Editor */}
				<div className="h-[70vh] relative">
					<Editor
						height="100%"
						language={language}
						theme={theme}
						value={code}
						onChange={handleCodeChange}
						options={{
							fontSize: 14,
							lineNumbers: "on",
							scrollBeyondLastLine: false,
							automaticLayout: true,
							padding: { top: 20, bottom: 20 },
							minimap: { enabled: false },
						}}
						loading={
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-1"></div>
							</div>
						}
					/>

					{/* Controls */}
					<div className="absolute bottom-0 left-0 bg-transparent w-full flex items-center justify-between px-6 pb-4">
						<div className="flex gap-4 text-sm">
							<div className="relative">
								<select
									value={language}
									onChange={(e) =>
										setLanguage(e.target.value)
									}
									className="px-4 py-2 pr-10 rounded-4xl appearance-none cursor-pointer bg-gray-2 text-xs font-medium"
								>
									<option value="html">HTML</option>
									<option value="css">CSS</option>
									<option value="javascript">
										JavaScript
									</option>
									<option value="typescript">
										TypeScript
									</option>
									<option value="python">Python</option>
									<option value="java">Java</option>
								</select>
								<Image
									src="/assets/down-arrow.svg"
									alt="chevron down"
									width={20}
									height={20}
									className="absolute right-3 top-1/2 transform -translate-y-1/2"
								/>
							</div>

							<div className="relative">
								<select
									value={theme}
									onChange={(e) => setTheme(e.target.value)}
									className="px-3 py-2 pr-10 rounded-4xl appearance-none cursor-pointer bg-gray-2 text-xs font-medium"
								>
									<option value="vs-dark">Dark</option>
									<option value="light">Light</option>
									<option value="hc-black">
										High Contrast
									</option>
								</select>

								<Image
									src="/assets/down-arrow.svg"
									alt="chevron down"
									width={20}
									height={20}
									className="absolute right-3 top-1/2 transform -translate-y-1/2"
								/>
							</div>
						</div>

						<button
							onClick={handleShare}
							disabled={isShareDisabled}
							className={`px-8 py-2 rounded-4xl bg-blue text-background font-medium text-lg flex items-center gap-2 cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed`}
						>
							<Image
								src="/assets/Share.svg"
								alt="share"
								width={20}
								height={20}
							/>
							Share
						</button>

						{/* URL Display if shared */}
						{isShared && (
							<div
								className={`max-w-[150px] flex items-center gap-2 absolute right-0 opacity-0 ${
									isShareDisabled
										? "opacity-100 right-45 transition-all duration-300"
										: ""
								}`}
							>
								<Image
									src="/assets/link.svg"
									alt="link"
									width={20}
									height={20}
								/>
								<span
									onClick={handleCopyUrl}
									className="truncate text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-400 hover:underline transition-all duration-300"
									style={{
										direction: "rtl",
										unicodeBidi: "plaintext",
									}}
								>
									{window.location.href}
								</span>

								{/* Copied Notification */}
								{showCopied && (
									<div className="absolute text-sm font-medium left-1/2 -translate-x-1/2 -top-8 text-gray-400 animate-fadeIn whitespace-nowrap">
										URL Copied!
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
