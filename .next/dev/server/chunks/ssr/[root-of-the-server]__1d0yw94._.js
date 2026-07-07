module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/components/UMANGChatbot.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "brandIcon": "UMANGChatbot-module__XAsxGG__brandIcon",
  "brandPill": "UMANGChatbot-module__XAsxGG__brandPill",
  "closeBtn": "UMANGChatbot-module__XAsxGG__closeBtn",
  "iframe": "UMANGChatbot-module__XAsxGG__iframe",
  "iframeWrap": "UMANGChatbot-module__XAsxGG__iframeWrap",
  "poweredBy": "UMANGChatbot-module__XAsxGG__poweredBy",
  "poweredByDot": "UMANGChatbot-module__XAsxGG__poweredByDot",
  "slideUpBtn": "UMANGChatbot-module__XAsxGG__slideUpBtn",
  "slideUpPanel": "UMANGChatbot-module__XAsxGG__slideUpPanel",
  "trigger": "UMANGChatbot-module__XAsxGG__trigger",
  "triggerFallback": "UMANGChatbot-module__XAsxGG__triggerFallback",
  "triggerIcon": "UMANGChatbot-module__XAsxGG__triggerIcon",
  "triggerLabel": "UMANGChatbot-module__XAsxGG__triggerLabel",
  "window": "UMANGChatbot-module__XAsxGG__window",
  "windowBrand": "UMANGChatbot-module__XAsxGG__windowBrand",
  "windowHeader": "UMANGChatbot-module__XAsxGG__windowHeader",
  "windowOpen": "UMANGChatbot-module__XAsxGG__windowOpen",
});
}),
"[project]/src/components/UMANGChatbot.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UMANGChatbot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/UMANGChatbot.module.css [app-ssr] (css module)");
"use client";
;
;
;
function UMANGChatbot() {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* Close signal from the chatbot iframe */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handler = (e)=>{
            if (e.data?.action === "handelCloseBotModal") setOpen(false);
            if (e.data?.action === "openLink" && e.data?.url) {
                window.location.href = e.data.url;
            }
        };
        window.addEventListener("message", handler);
        return ()=>window.removeEventListener("message", handler);
    }, []);
    const openChat = ()=>{
        setOpen(true);
        setTimeout(()=>{
            iframeRef.current?.contentWindow?.postMessage({
                action: "handelOpeningBot"
            }, "*");
        }, 350);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                id: "chatbot-button",
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trigger,
                onClick: openChat,
                "aria-label": "Open UMANG AI Assistant",
                title: "Ask UMANG AI",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png",
                        alt: "UMANG AI",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].triggerIcon,
                        onError: (e)=>{
                            e.target.style.display = "none";
                            const fb = e.target.nextSibling;
                            if (fb) fb.style.display = "flex";
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].triggerFallback,
                        children: "🤖"
                    }, void 0, false, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].triggerLabel,
                        children: "Ask UMANG AI"
                    }, void 0, false, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 63,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/UMANGChatbot.js",
                lineNumber: 45,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "chatbot-window",
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].window} ${open ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].windowOpen : ""}`,
                "aria-hidden": !open,
                "aria-label": "UMANG AI Chat",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].windowHeader,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].windowBrand,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "https://cdngovai.myscheme.in/64b15bf4c3a58e12cb335ec0/68108e5af2c4864461329009/logos/icon_2-icon.png",
                                        alt: "UMANG",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brandIcon,
                                        width: 26,
                                        height: 26
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/UMANGChatbot.js",
                                        lineNumber: 77,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "GovGrant AI Assistant"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/UMANGChatbot.js",
                                        lineNumber: 84,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].brandPill,
                                        children: "UMANG"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/UMANGChatbot.js",
                                        lineNumber: 85,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/UMANGChatbot.js",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                                onClick: ()=>setOpen(false),
                                "aria-label": "Close chat",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/components/UMANGChatbot.js",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].poweredBy,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].poweredByDot
                            }, void 0, false, {
                                fileName: "[project]/src/components/UMANGChatbot.js",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            "Powered by UMANG AI • Government of India",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].poweredByDot
                            }, void 0, false, {
                                fileName: "[project]/src/components/UMANGChatbot.js",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iframeWrap,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                            ref: iframeRef,
                            id: "chatbot-iframe",
                            src: "https://chatbot.umangapp.in/",
                            title: "UMANG AI Chatbot",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$UMANGChatbot$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iframe,
                            allow: "clipboard-write; microphone",
                            scrolling: "no",
                            sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                        }, void 0, false, {
                            fileName: "[project]/src/components/UMANGChatbot.js",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/UMANGChatbot.js",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/UMANGChatbot.js",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1d0yw94._.js.map