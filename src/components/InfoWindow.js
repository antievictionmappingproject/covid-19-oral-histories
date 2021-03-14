import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";

const BlogImage = (props) => {
	return <img {...props} style={{ maxWidth: "100%" }} />;
};
const BlogVideo = (props) => {
	return <video {...props} style={{ maxWidth: "100%" }} />;
};
const BlogAudio = (props) => {
	return <audio {...props} style={{ maxWidth: "100%" }} />;
};

function parseNodeFromHTML(htmlString) {
	var div = document.createElement("div");
	div.innerHTML = htmlString.trim();

	// Change this to div.childNodes to support multiple top-level nodes
	return div.firstChild;
}

const Embed = (props) => {
	const node = parseNodeFromHTML(props.value);
	function getComponent(type) {
		switch (type) {
			case "IMG":
				return <BlogImage src={node.src} />;
			case "VIDEO":
				return <BlogVideo controls src={node.src} />;
			case "AUDIO":
				return <BlogAudio controls src={node.src} />;
			default:
				return null;
		}
	}
	return getComponent(node.nodeName);
};

export default (props) => {
	const interviewSelected = useSelector((state) => state.ui.interviewSelected);
	const dispatch = useDispatch();

	return (
		<div className="aemp-infowindow">
			<span
				className="aemp-infowindow-close"
				onClick={() => {
					dispatch({ type: "ui:interview:selected", payload: null });
				}}
			>
				×
			</span>
			<div>
				<ReactMarkdown
					escapeHtml={false}
					renderers={{ html: Embed }}
					allowNode={(node, index, parent) => {
						console.log(node, index, parent);
						return true;
					}}
				>
					{interviewSelected.fields.DEV_content}
				</ReactMarkdown>
			</div>
		</div>
	);
};
