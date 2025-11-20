// import React, { useEffect, useState } from 'react'

// const Customizer = () => {
//     const [themeOption, setThemeOption] = useState('css/style.min.css'); // Default light theme

//     const toggleTheme = (cssFilePath) => {
//         setThemeOption(cssFilePath); // Change the theme when the user clicks the theme option
//     };

//     useEffect(() => {
//         // Update the <link> tag with the selected themeOption
//         const linkElement = document.getElementById('themeStylesheet');
//         if (linkElement) {
//             linkElement.href = themeOption;
//         } else {
//             const newLink = document.createElement('link');
//             newLink.id = 'themeStylesheet';
//             newLink.rel = 'stylesheet';
//             newLink.href = themeOption;
//             document.head.appendChild(newLink);
//         }
//     }, [themeOption]); // This effect will run every time the themeOption changes

//     const [themeColor, setThemeColor] = useState('css/style.min.css'); // Default theme (blue)

//     const toggleThemeColor = (cssFilePath) => {
//         setThemeColor(cssFilePath); // Update the themeColor when an option is clicked
//     };

//     useEffect(() => {
//         const linkElement = document.getElementById('themeStylesheet');
//         if (linkElement) {
//             linkElement.href = themeColor;
//         } else {
//             const newLink = document.createElement('link');
//             newLink.id = 'themeStylesheet';
//             newLink.rel = 'stylesheet';
//             newLink.href = themeColor;
//             document.head.appendChild(newLink);
//         }
//     }, [themeColor]);


//     return (
//         <>
//             <button className="btn btn-primary p-3 rounded-circle d-flex align-items-center justify-content-center customizer-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
//                 <i className="ti ti-settings fs-7" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Settings"></i>
//             </button>
//             <div className="offcanvas offcanvas-end customizer d-flex flex-column" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" data-simplebar="">
//                 <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
//                     <h4 className="offcanvas-title fw-semibold" id="offcanvasExampleLabel">Settings</h4>
//                     <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//                 </div>
//                 <div className="offcanvas-body p-4">
//                     <div className="theme-option pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Theme Option</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             {/* Light theme button */}
//                             <a
//                                 href="javascript:void(0)"
//                                 onClick={() => toggleTheme('/css/style.min.css')} // Light theme
//                                 className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 light-theme text-dark"
//                             >
//                                 <i className="ti ti-brightness-up fs-7 text-primary"></i>
//                                 <span className="text-dark">Light</span>
//                             </a>

//                             {/* Dark theme button */}
//                             <a
//                                 href="javascript:void(0)"
//                                 onClick={() => toggleTheme('/css/style-dark.min.css')} // Dark theme
//                                 className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 dark-theme text-dark"
//                             >
//                                 <i className="ti ti-moon fs-7 "></i>
//                                 <span className="text-dark">Dark</span>
//                             </a>
//                         </div>
//                     </div>
//                     <div className="theme-direction pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Theme Direction</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <a href="index" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
//                                 <i className="ti ti-text-direction-ltr fs-6 text-primary"></i>
//                                 <span className="text-dark">LTR</span>
//                             </a>
//                             <a href="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/html/rtl/index" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
//                                 <i className="ti ti-text-direction-rtl fs-6 text-dark"></i>
//                                 <span className="text-dark">RTL</span>
//                             </a>
//                         </div>
//                     </div>
//                     <div className="theme-colors pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Theme Colors</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <ul className="list-unstyled mb-0 d-flex gap-3 flex-wrap change-colors">
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin1-bluetheme-primary"
//                                         onClick={() => toggleThemeColor('css/style.min.css')}
//                                         data-color="blue_theme"
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="BLUE_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin2-aquatheme-primary"
//                                         onClick={() => toggleThemeColor('css/style-aqua.min.css')}
//                                         data-color="aqua_theme"
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="AQUA_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin3-purpletheme-primary"
//                                         onClick={() => toggleThemeColor('css/style-purple.min.css')}
//                                         data-color="purple_theme"
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="PURPLE_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin4-greentheme-primary"
//                                         onClick={() => toggleThemeColor('css/style-green.min.css')}
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="GREEN_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin5-cyantheme-primary"
//                                         onClick={() => toggleThemeColor('css/style-cyan.min.css')}
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="CYAN_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                                 <li className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center justify-content-center">
//                                     <a
//                                         href="javascript:void(0)"
//                                         className="rounded-circle position-relative d-block customizer-bgcolor skin6-orangetheme-primary"
//                                         onClick={() => toggleThemeColor('css/style-orange.min.css')}
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         data-bs-title="ORANGE_THEME"
//                                     >
//                                         <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="layout-type pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Layout Type</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <a href="index" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
//                                 <i className="ti ti-layout-sidebar fs-6 text-primary"></i>
//                                 <span className="text-dark">Vertical</span>
//                             </a>
//                             <a href="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/html/horizontal/index" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2">
//                                 <i className="ti ti-layout-navbar fs-6 text-dark"></i>
//                                 <span className="text-dark">Horizontal</span>
//                             </a>
//                         </div>
//                     </div>
//                     <div className="container-option pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Container Option</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 boxed-width text-dark">
//                                 <i className="ti ti-layout-distribute-vertical fs-7 text-primary"></i>
//                                 <span className="text-dark">Boxed</span>
//                             </a>
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 full-width text-dark">
//                                 <i className="ti ti-layout-distribute-horizontal fs-7"></i>
//                                 <span className="text-dark">Full</span>
//                             </a>
//                         </div>
//                     </div>
//                     <div className="sidebar-type pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Sidebar Type</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 fullsidebar">
//                                 <i className="ti ti-layout-sidebar-right fs-7"></i>
//                                 <span className="text-dark">Full</span>
//                             </a>
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center text-dark sidebartoggler gap-2">
//                                 <i className="ti ti-layout-sidebar fs-7"></i>
//                                 <span className="text-dark">Collapse</span>
//                             </a>
//                         </div>
//                     </div>
//                     <div className="card-with pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Card With</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 text-dark cardborder">
//                                 <i className="ti ti-border-outer fs-7"></i>
//                                 <span className="text-dark">Border</span>
//                             </a>
//                             <a href="javascript:void(0)" className="rounded-2 p-9 customizer-box hover-img d-flex align-items-center gap-2 cardshadow">
//                                 <i className="ti ti-border-none fs-7"></i>
//                                 <span className="text-dark">Shadow</span>
//                             </a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Customizer






// import React, { useEffect, useState } from 'react';

// const Customizer = () => {
//     // State for theme settings
//     const [themeSettings, setThemeSettings] = useState({
//         mode: 'light', // 'light' or 'dark'
//         color: 'blue', // color scheme
//         direction: 'ltr', // 'ltr' or 'rtl'
//         layout: 'vertical', // 'vertical' or 'horizontal'
//         container: 'full', // 'boxed' or 'full'
//         sidebar: 'full', // 'full' or 'collapsed'
//         cardStyle: 'shadow' // 'border' or 'shadow'
//     });

//     // Initialize from localStorage
//     useEffect(() => {
//         const savedSettings = localStorage.getItem('themeSettings');
//         if (savedSettings) {
//             setThemeSettings(JSON.parse(savedSettings));
//             applyThemeSettings(JSON.parse(savedSettings));
//         }
//     }, []);

//     // Apply theme settings to the document
//     const applyThemeSettings = (settings) => {
//         // Remove all existing theme classes
//         document.documentElement.className = '';
//         document.body.className = '';

//         // Apply mode (light/dark)
//         document.documentElement.classList.add(`theme-${settings.mode}`);

//         // Apply color scheme
//         document.documentElement.classList.add(`color-${settings.color}`);

//         // Apply direction
//         document.documentElement.setAttribute('dir', settings.direction);
//         document.body.classList.add(settings.direction);

//         // Apply layout
//         document.body.classList.add(`layout-${settings.layout}`);

//         // Apply container
//         document.body.classList.add(`container-${settings.container}`);

//         // Apply sidebar
//         document.body.classList.add(`sidebar-${settings.sidebar}`);

//         // Apply card style
//         document.body.classList.add(`card-${settings.cardStyle}`);

//         // Update localStorage
//         localStorage.setItem('themeSettings', JSON.stringify(settings));
//     };

//     // Handle setting changes
//     const handleSettingChange = (key, value) => {
//         const newSettings = {
//             ...themeSettings,
//             [key]: value
//         };
//         setThemeSettings(newSettings);
//         applyThemeSettings(newSettings);
//     };

//     // Define color options
//     const colorOptions = [
//         { id: 'blue', name: 'Blue', class: 'skin1-bluetheme-primary' },
//         { id: 'aqua', name: 'Aqua', class: 'skin2-aquatheme-primary' },
//         { id: 'purple', name: 'Purple', class: 'skin3-purpletheme-primary' },
//         { id: 'green', name: 'Green', class: 'skin4-greentheme-primary' },
//         { id: 'cyan', name: 'Cyan', class: 'skin5-cyantheme-primary' },
//         { id: 'orange', name: 'Orange', class: 'skin6-orangetheme-primary' }
//     ];

//     return (
//         <>
//             {/* Customizer Toggle Button */}
//             <button
//                 className="btn btn-primary p-3 rounded-circle d-flex align-items-center justify-content-center customizer-btn"
//                 type="button"
//                 data-bs-toggle="offcanvas"
//                 data-bs-target="#themeCustomizer"
//                 aria-controls="themeCustomizer"
//             >
//                 <i className="ti ti-settings fs-7"></i>
//             </button>

//             {/* Customizer Panel */}
//             <div className="offcanvas offcanvas-end customizer" tabIndex="-1" id="themeCustomizer" aria-labelledby="themeCustomizerLabel">
//                 <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
//                     <h4 className="offcanvas-title fw-semibold" id="themeCustomizerLabel">Theme Settings</h4>
//                     <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
//                 </div>

//                 <div className="offcanvas-body p-4">
//                     {/* Theme Mode */}
//                     <div className="theme-option pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Theme Mode</h6>
//                         <div className="d-flex align-items-center gap-3 my-3">
//                             <button
//                                 type="button"
//                                 onClick={() => handleSettingChange('mode', 'light')}
//                                 className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.mode === 'light' ? 'active-theme' : ''}`}
//                             >
//                                 <i className={`ti ti-brightness-up fs-7 ${themeSettings.mode === 'light' ? 'text-primary' : ''}`}></i>
//                                 <span>Light</span>
//                             </button>

//                             <button
//                                 type="button"
//                                 onClick={() => handleSettingChange('mode', 'dark')}
//                                 className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.mode === 'dark' ? 'active-theme' : ''}`}
//                             >
//                                 <i className={`ti ti-moon fs-7 ${themeSettings.mode === 'dark' ? 'text-primary' : ''}`}></i>
//                                 <span>Dark</span>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Theme Colors */}
//                     <div className="theme-colors pb-4">
//                         <h6 className="fw-semibold fs-4 mb-1">Theme Colors</h6>
//                         <div className="d-flex flex-wrap gap-3 my-3">
//                             {colorOptions.map((color) => (
//                                 <div key={color.id} className="rounded-2 p-2 customizer-box hover-img">
//                                     <button
//                                         type="button"
//                                         onClick={() => handleSettingChange('color', color.id)}
//                                         className={`rounded-circle position-relative d-block customizer-bgcolor ${color.class}`}
//                                         data-bs-toggle="tooltip"
//                                         data-bs-placement="top"
//                                         title={color.name.toUpperCase()}
//                                     >
//                                         {themeSettings.color === color.id && (
//                                             <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
//                                         )}
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Layout Options */}
//                     <div className="layout-options">
//                         {/* Direction */}
//                         <div className="theme-direction pb-4">
//                             <h6 className="fw-semibold fs-4 mb-1">Theme Direction</h6>
//                             <div className="d-flex align-items-center gap-3 my-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('direction', 'ltr')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.direction === 'ltr' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-text-direction-ltr fs-6"></i>
//                                     <span>LTR</span>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('direction', 'rtl')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.direction === 'rtl' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-text-direction-rtl fs-6"></i>
//                                     <span>RTL</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Layout Type */}
//                         <div className="layout-type pb-4">
//                             <h6 className="fw-semibold fs-4 mb-1">Layout Type</h6>
//                             <div className="d-flex align-items-center gap-3 my-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('layout', 'vertical')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.layout === 'vertical' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-sidebar-right fs-6"></i>
//                                     <span>Vertical</span>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('layout', 'horizontal')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.layout === 'horizontal' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-navbar fs-6"></i>
//                                     <span>Horizontal</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Container Option */}
//                         <div className="container-option pb-4">
//                             <h6 className="fw-semibold fs-4 mb-1">Container Option</h6>
//                             <div className="d-flex align-items-center gap-3 my-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('container', 'boxed')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.container === 'boxed' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-distribute-vertical fs-7"></i>
//                                     <span>Boxed</span>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('container', 'full')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.container === 'full' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-distribute-horizontal fs-7"></i>
//                                     <span>Full</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Sidebar Type */}
//                         <div className="sidebar-type pb-4">
//                             <h6 className="fw-semibold fs-4 mb-1">Sidebar Type</h6>
//                             <div className="d-flex align-items-center gap-3 my-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('sidebar', 'full')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.sidebar === 'full' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-sidebar-right fs-7"></i>
//                                     <span>Full</span>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('sidebar', 'collapsed')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.sidebar === 'collapsed' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-layout-sidebar fs-7"></i>
//                                     <span>Collapse</span>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Card Style */}
//                         <div className="card-with pb-4">
//                             <h6 className="fw-semibold fs-4 mb-1">Card Style</h6>
//                             <div className="d-flex align-items-center gap-3 my-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('cardStyle', 'border')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.cardStyle === 'border' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-border-outer fs-7"></i>
//                                     <span>Border</span>
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleSettingChange('cardStyle', 'shadow')}
//                                     className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${themeSettings.cardStyle === 'shadow' ? 'active-theme' : ''}`}
//                                 >
//                                     <i className="ti ti-border-none fs-7"></i>
//                                     <span>Shadow</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Customizer;











import React, { useEffect, useState } from 'react';

const Customizer = () => {
    // State for theme settings
    const [themeOption, setThemeOption] = useState('css/style.min.css');
    const [themeColor, setThemeColor] = useState('css/style.min.css');
    const [activeTheme, setActiveTheme] = useState('light');
    const [activeColor, setActiveColor] = useState('blue_theme');

    // Apply theme changes
    const applyTheme = (cssFilePath, type) => {
        const linkElement = document.getElementById('themeStylesheet');

        if (linkElement) {
            linkElement.href = cssFilePath;
        } else {
            const newLink = document.createElement('link');
            newLink.id = 'themeStylesheet';
            newLink.rel = 'stylesheet';
            newLink.href = cssFilePath;
            document.head.appendChild(newLink);
        }

        // Store preferences in localStorage
        localStorage.setItem('themePreference', JSON.stringify({
            theme: activeTheme,
            color: activeColor
        }));
    };

    // Toggle between light/dark theme
    const toggleTheme = (cssFilePath, themeName) => {
        setThemeOption(cssFilePath);
        setActiveTheme(themeName);
        applyTheme(cssFilePath, 'mode');
    };

    // Toggle between color themes
    const toggleThemeColor = (cssFilePath, colorName) => {
        setThemeColor(cssFilePath);
        setActiveColor(colorName);
        applyTheme(cssFilePath, 'color');
    };

    // Initialize from localStorage
    useEffect(() => {
        const savedPreferences = localStorage.getItem('themePreference');
        if (savedPreferences) {
            const { theme, color } = JSON.parse(savedPreferences);
            setActiveTheme(theme);
            setActiveColor(color);

            // Set initial theme paths based on saved preferences
            if (theme === 'dark') {
                setThemeOption('css/style-dark.min.css');
                applyTheme('css/style-dark.min.css', 'mode');
            }

            // Set initial color path based on saved preferences
            const colorMap = {
                'blue_theme': 'css/style.min.css',
                'aqua_theme': 'css/style-aqua.min.css',
                'purple_theme': 'css/style-purple.min.css',
                'green_theme': 'css/style-green.min.css',
                'cyan_theme': 'css/style-cyan.min.css',
                'orange_theme': 'css/style-orange.min.css'
            };

            if (colorMap[color]) {
                setThemeColor(colorMap[color]);
                applyTheme(colorMap[color], 'color');
            }
        }
    }, []);

    return (
        <>
            <button
                className="btn btn-primary p-3 rounded-circle d-flex align-items-center justify-content-center customizer-btn"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#themeCustomizer"
                aria-controls="themeCustomizer"
            >
                <i className="ti ti-settings fs-7"></i>
            </button>

            <div className="offcanvas offcanvas-end customizer" tabIndex="-1" id="themeCustomizer" aria-labelledby="themeCustomizerLabel">
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                    <h4 className="offcanvas-title fw-semibold" id="themeCustomizerLabel">Theme Settings</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body p-4">
                    {/* Theme Mode */}
                    <div className="theme-option pb-4">
                        <h6 className="fw-semibold fs-4 mb-1">Theme Mode</h6>
                        <div className="d-flex align-items-center gap-3 my-3">
                            <button
                                type="button"
                                onClick={() => toggleTheme('/css/style.min.css', 'light')}
                                className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${activeTheme === 'light' ? 'active-theme' : ''}`}
                            >
                                <i className={`ti ti-brightness-up fs-7 ${activeTheme === 'light' ? 'text-primary' : ''}`}></i>
                                <span>Light</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => toggleTheme('/css/style-dark.min.css', 'dark')}
                                className={`rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 ${activeTheme === 'dark' ? 'active-theme' : ''}`}
                            >
                                <i className={`ti ti-moon fs-7 ${activeTheme === 'dark' ? 'text-primary' : ''}`}></i>
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* Theme Colors */}
                    <div className="theme-colors pb-4">
                        <h6 className="fw-semibold fs-4 mb-1">Theme Colors</h6>
                        <div className="d-flex flex-wrap gap-3 my-3">
                            {[
                                { name: 'blue_theme', path: 'css/style.min.css', bgClass: 'skin1-bluetheme-primary' },
                                { name: 'aqua_theme', path: 'css/style-aqua.min.css', bgClass: 'skin2-aquatheme-primary' },
                                { name: 'purple_theme', path: 'css/style-purple.min.css', bgClass: 'skin3-purpletheme-primary' },
                                { name: 'green_theme', path: 'css/style-green.min.css', bgClass: 'skin4-greentheme-primary' },
                                { name: 'cyan_theme', path: 'css/style-cyan.min.css', bgClass: 'skin5-cyantheme-primary' },
                                { name: 'orange_theme', path: 'css/style-orange.min.css', bgClass: 'skin6-orangetheme-primary' }
                            ].map((color) => (
                                <div key={color.name} className="rounded-2 p-2 customizer-box hover-img">
                                    <button
                                        type="button"
                                        onClick={() => toggleThemeColor(color.path, color.name)}
                                        className={`rounded-circle position-relative d-block customizer-bgcolor ${color.bgClass}`}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title={color.name.replace('_', ' ').toUpperCase()}
                                    >
                                        {activeColor === color.name && (
                                            <i className="ti ti-check text-white d-flex align-items-center justify-content-center fs-5"></i>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Layout Options */}
                    <div className="layout-options">
                        <div className="theme-direction pb-4">
                            <h6 className="fw-semibold fs-4 mb-1">Theme Direction</h6>
                            <div className="d-flex align-items-center gap-3 my-3">
                                <a href="index" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2">
                                    <i className="ti ti-text-direction-ltr fs-6 text-primary"></i>
                                    <span>LTR</span>
                                </a>
                                <a href="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/html/rtl/index" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2">
                                    <i className="ti ti-text-direction-rtl fs-6 text-dark"></i>
                                    <span>RTL</span>
                                </a>
                            </div>
                        </div>

                        <div className="layout-type pb-4">
                            <h6 className="fw-semibold fs-4 mb-1">Layout Type</h6>
                            <div className="d-flex align-items-center gap-3 my-3">
                                <a href="index" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2">
                                    <i className="ti ti-layout-sidebar fs-6 text-primary"></i>
                                    <span>Vertical</span>
                                </a>
                                <a href="https://demos.adminmart.com/premium/bootstrap/modernize-bootstrap/package/html/horizontal/index" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2">
                                    <i className="ti ti-layout-navbar fs-6 text-dark"></i>
                                    <span>Horizontal</span>
                                </a>
                            </div>
                        </div>

                        <div className="container-option pb-4">
                            <h6 className="fw-semibold fs-4 mb-1">Container Option</h6>
                            <div className="d-flex align-items-center gap-3 my-3">
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 boxed-width text-dark">
                                    <i className="ti ti-layout-distribute-vertical fs-7 text-primary"></i>
                                    <span>Boxed</span>
                                </a>
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 full-width text-dark">
                                    <i className="ti ti-layout-distribute-horizontal fs-7"></i>
                                    <span>Full</span>
                                </a>
                            </div>
                        </div>

                        <div className="sidebar-type pb-4">
                            <h6 className="fw-semibold fs-4 mb-1">Sidebar Type</h6>
                            <div className="d-flex align-items-center gap-3 my-3">
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 fullsidebar">
                                    <i className="ti ti-layout-sidebar-right fs-7"></i>
                                    <span>Full</span>
                                </a>
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center text-dark sidebartoggler gap-2">
                                    <i className="ti ti-layout-sidebar fs-7"></i>
                                    <span>Collapse</span>
                                </a>
                            </div>
                        </div>

                        <div className="card-with pb-4">
                            <h6 className="fw-semibold fs-4 mb-1">Card Style</h6>
                            <div className="d-flex align-items-center gap-3 my-3">
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 text-dark cardborder">
                                    <i className="ti ti-border-outer fs-7"></i>
                                    <span>Border</span>
                                </a>
                                <a href="javascript:void(0)" className="rounded-2 p-3 customizer-box hover-img d-flex align-items-center gap-2 cardshadow">
                                    <i className="ti ti-border-none fs-7"></i>
                                    <span>Shadow</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add this to your CSS */}
            <style jsx>{`
                .active-theme {
                    border: 2px solid var(--bs-primary) !important;
                    background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
                }
                .customizer-box {
                    transition: all 0.3s ease;
                    border: 1px solid var(--bs-border-color);
                }
                .customizer-box:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .customizer-bgcolor {
                    width: 30px;
                    height: 30px;
                    transition: all 0.3s ease;
                }
                .customizer-bgcolor:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </>
    );
};

export default Customizer;