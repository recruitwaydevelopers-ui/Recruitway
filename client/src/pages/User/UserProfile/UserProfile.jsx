// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuthContext } from '../../../context/auth-context';
// import toast from 'react-hot-toast';
// import PasswordCheck from '../../../components/PasswordCheck';

// const UserProfile = () => {
//     const [profile, setProfile] = useState({
//         profilePicture: null,
//         fullname: "",
//         gender: "male",
//         dob: "",
//         age: {
//             years: "0",
//             months: "0",
//             days: "0"
//         },
//         headline: "",
//         location: "",
//         phone: "",
//         summary: "",
//         experience: [
//             {
//                 title: "",
//                 company: "",
//                 location: "",
//                 startDate: "",
//                 endDate: "",
//                 description: ""
//             }
//         ],
//         education: [
//             {
//                 degree: "",
//                 institution: "",
//                 year: ""
//             }
//         ],
//         skills: [
//             { skills: "" }
//         ],
//         certifications: [
//             {
//                 certificates: "",
//                 issuer: "",
//                 year: ""
//             }
//         ],
//         languages: [
//             { languages: "" }
//         ],
//         projects: [
//             {
//                 projects: "",
//                 description: "",
//                 year: ""
//             }
//         ],
//         socialMedia: {
//             linkedin: "",
//             twitter: "",
//             facebook: "",
//             github: ""
//         },
//         resume: null
//     });

//     const { server, fetchUserData } = useAuthContext()
//     const token = localStorage.getItem("token")

//     const [editMode, setEditMode] = useState(false);
//     const [activeSection, setActiveSection] = useState('summary');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
//     const [preview, setPreview] = useState('');
//     const [previewResume, setPreviewResume] = useState('');

//     const getProfile = async () => {
//         try {
//             const response = await axios.get(`${server}/api/v1/candidate/getprofile`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             const data = response.data.data || {};

//             setProfile({
//                 profilePicture: data.profilePicture || null,
//                 fullname: data.fullname || "",
//                 headline: data.headline || "",
//                 location: data.location || "",
//                 phone: data.phone || "",
//                 summary: data.summary || "",
//                 gender: data.gender || "",
//                 dob: data.dob || "",
//                 experience: data.experience || [],
//                 education: data.education || [],
//                 skills: data.skills || [],
//                 certifications: data.certifications || [],
//                 languages: data.languages || [],
//                 projects: data.projects || [],
//                 socialMedia: data.socialMedia || { linkedin: "", twitter: "", facebook: "", github: "" },
//                 resume: data.resume || null
//             });
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to fetch profile');
//         }
//     };

//     useEffect(() => {
//         if (token) {
//             getProfile();
//         }
//     }, [token]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setProfile(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSocialMediaChange = (e) => {
//         const { name, value } = e.target;
//         setProfile(prev => ({
//             ...prev,
//             socialMedia: {
//                 ...prev.socialMedia,
//                 [name]: value
//             }
//         }));
//     };

//     const handleArrayChange = (arrayName, index, field, value) => {
//         setProfile(prev => {
//             const updatedArray = [...prev[arrayName]];
//             updatedArray[index] = { ...updatedArray[index], [field]: value };
//             return { ...prev, [arrayName]: updatedArray };
//         });
//     };

//     const addNewItem = (arrayName, template) => {
//         setProfile(prev => ({
//             ...prev,
//             [arrayName]: [...prev[arrayName], template]
//         }));
//     };

//     const removeItem = (arrayName, index) => {
//         setProfile(prev => ({
//             ...prev,
//             [arrayName]: prev[arrayName].filter((_, i) => i !== index)
//         }));
//     };

//     const handleFileChangenew = (e) => {
//         const { name, files } = e.target;
//         const file = files[0];

//         if (!file) {
//             setProfile((prev) => ({ ...prev, [name]: null }));
//             return;
//         }

//         const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

//         const allowedTypesMap = {
//             resume: [
//                 'application/pdf',
//                 'application/msword',
//                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//             ],
//             profilePicture: [
//                 'image/jpeg',
//                 'image/jpg',
//                 'image/png',
//                 'image/webp',
//             ]
//         };

//         const allowedTypes = allowedTypesMap[name];

//         if (!allowedTypes.includes(file.type)) {
//             const errorText =
//                 name === 'resume'
//                     ? 'Only PDF, DOC, and DOCX formats are allowed for resumes.'
//                     : 'Only JPG, JPEG, PNG, and WEBP formats are allowed for profile pictures.';

//             setSubmitMessage({ text: errorText, type: 'error' });
//             setProfile((prev) => ({ ...prev, [name]: null }));
//             return;
//         }

//         if (file.size > maxSizeInBytes) {
//             setSubmitMessage({ text: 'File size should be less than 5MB.', type: 'error' });
//             setProfile((prev) => ({ ...prev, [name]: null }));
//             return;
//         }

//         setProfile((prev) => ({ ...prev, [name]: file }));
//         setSubmitMessage({ text: '', type: '' });
//     };

//     useEffect(() => {
//         const pic = profile.profilePicture;

//         if (!pic) {
//             setPreview('');
//             return;
//         }

//         if (pic instanceof File) {
//             const objectUrl = URL.createObjectURL(pic);
//             setPreview(objectUrl);

//             return () => {
//                 URL.revokeObjectURL(objectUrl);
//             };
//         }

//         if (typeof pic === 'string') {
//             setPreview(pic);
//         }
//     }, [profile.profilePicture]);

//     useEffect(() => {
//         const resume = profile.resume;

//         if (!resume || !(resume instanceof File)) {
//             setPreviewResume('');
//             return;
//         }

//         const objectUrl = URL.createObjectURL(resume);
//         setPreviewResume(objectUrl);

//         return () => {
//             URL.revokeObjectURL(objectUrl);
//         };
//     }, [profile.resume]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setSubmitMessage({ type: '', text: '' });

//         try {
//             const formData = new FormData();

//             // Append simple fields
//             formData.append('fullname', profile.fullname);
//             formData.append('headline', profile.headline);
//             formData.append('location', profile.location);
//             formData.append('phone', profile.phone);
//             formData.append('summary', profile.summary);
//             formData.append('gender', profile.gender);
//             formData.append('dob', profile.dob);

//             // Append nested objects (stringify them)
//             formData.append('socialMedia', JSON.stringify(profile.socialMedia));

//             // Append arrays (stringify them)
//             formData.append('experience', JSON.stringify(profile.experience));
//             formData.append('education', JSON.stringify(profile.education));
//             formData.append('skills', JSON.stringify(profile.skills));
//             formData.append('certifications', JSON.stringify(profile.certifications));
//             formData.append('languages', JSON.stringify(profile.languages));
//             formData.append('projects', JSON.stringify(profile.projects));

//             // Append files if they exist
//             if (profile.profilePicture) {
//                 formData.append('profilePicture', profile.profilePicture);
//             }
//             if (profile.resume) {
//                 formData.append('resume', profile.resume);
//             }

//             const response = await axios.post(`${server}/api/v1/candidate/createprofile`,
//                 formData,
//                 {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );
//             setSubmitMessage({ type: 'success', text: 'Profile updated successfully!' });
//             setEditMode(false);
//         } catch (error) {
//             setSubmitMessage({
//                 type: 'error',
//                 text: error.response?.data?.message || 'Failed to update profile. Please try again.'
//             });
//         } finally {
//             setIsSubmitting(false);
//             fetchUserData(token)
//         }
//     };

//     const calculateExactAge = (dob) => {
//         const birthDate = new Date(dob);
//         const today = new Date();

//         let years = today.getFullYear() - birthDate.getFullYear();
//         let months = today.getMonth() - birthDate.getMonth();
//         let days = today.getDate() - birthDate.getDate();

//         if (days < 0) {
//             // Go back one month
//             months--;
//             const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
//             days += prevMonth.getDate();
//         }

//         if (months < 0) {
//             // Go back one year
//             years--;
//             months += 12;
//         }

//         return { years, months, days };
//     };

//     useEffect(() => {
//         if (profile.dob) {
//             const exactAge = calculateExactAge(profile.dob);
//             setProfile(prev => ({ ...prev, age: exactAge }));
//         }
//     }, [profile.dob])

//     const wordLimit = 1000;
//     const [wordCount, setWordCount] = useState(profile?.summary?.length);
//     const [summaryError, setSummaryError] = useState('');

//     const handleSummaryChange = (e) => {
//         const { value } = e.target;
//         const words = value
//         const count = words.length;

//         if (count <= wordLimit) {
//             setProfile(prev => ({ ...prev, summary: value }));
//             setWordCount(count);
//             setSummaryError('');
//         } else {
//             setSummaryError(`Maximum ${wordLimit} words allowed.`);
//         }
//     };

//     const [showPasswordModal, setShowPasswordModal] = useState(false)
//     const handleEditClick = () => {
//         setShowPasswordModal(true);
//     };

//     const handlePasswordVerify = async (password) => {
//         try {
//             if (!password) {
//                 return toast.error("Please enter your password.");
//             }

//             const response = await axios.post(`${server}/api/v1/auth/checkPassword`,
//                 { password },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 toast.success("Password verified successfully!");
//                 setEditMode(true);
//             } else {
//                 toast.error(response.data.message || "Password verification failed.");
//             }
//         } catch (error) {
//             console.error("Password verification error:", error);
//             toast.error(error.response?.data?.message || "Something went wrong during password verification.");
//         }
//     };

//     return (
//         <>
//             <div className="container-fluid">
//                 <div className="container">
//                     {/* Form wrapper */}
//                     <form onSubmit={editMode ? handleSubmit : (e) => e.preventDefault()}>
//                         {/* Submit message */}
//                         {submitMessage.text && (
//                             <div className={`alert alert-${submitMessage.type === 'success' ? 'success' : 'danger'} mt-3`}>
//                                 {submitMessage.text}
//                             </div>
//                         )}

//                         {/* Profile Header */}
//                         <div className="row mb-4">
//                             <div className="col-md-12">
//                                 <div className="card shadow-sm">
//                                     <div className="card-body">
//                                         <div className="d-flex flex-column flex-sm-row align-items-start gap-3">
//                                             <div className="d-flex flex-column align-items-start text-center mb-4">
//                                                 <div className="position-relative mb-3">
//                                                     <img
//                                                         src={preview || profile.profilePicture || '/images/logos/user-pic.png'}
//                                                         alt="Profile Pic"
//                                                         className="img-fluid rounded-circle border border-4 border-light"
//                                                         style={{ width: '150px', height: '150px', objectFit: 'cover' }}
//                                                     />
//                                                     {
//                                                         editMode && (
//                                                             <label
//                                                                 htmlFor="logo"
//                                                                 className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle cursor-pointer hover-bg-primary"
//                                                             >
//                                                                 <svg
//                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                     width="16"
//                                                                     height="16"
//                                                                     fill="currentColor"
//                                                                     className="bi bi-camera"
//                                                                     viewBox="0 0 16 16"
//                                                                 >
//                                                                     <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
//                                                                     <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
//                                                                 </svg>
//                                                                 <input
//                                                                     id="logo"
//                                                                     type="file"
//                                                                     name='profilePicture'
//                                                                     accept="image/*"
//                                                                     onChange={handleFileChangenew}
//                                                                     className="visually-hidden"
//                                                                 />
//                                                             </label>
//                                                         )
//                                                     }
//                                                 </div>
//                                                 {
//                                                     editMode && (
//                                                         <p className="text-muted small">Click on the camera icon to change your Profile Picture</p>
//                                                     )
//                                                 }
//                                             </div>
//                                             <div className="d-flex flex-column align-items-start gap-4">
//                                                 <div className="w-100 text-md-start">
//                                                     {editMode ? (
//                                                         <>
//                                                             <input
//                                                                 type="text"
//                                                                 name="fullname"
//                                                                 value={profile.fullname}
//                                                                 onChange={handleInputChange}
//                                                                 className="form-control form-control-lg mb-2"
//                                                                 placeholder='Full Name'
//                                                                 required
//                                                             />
//                                                             <input
//                                                                 type="text"
//                                                                 name="headline"
//                                                                 value={profile.headline}
//                                                                 onChange={handleInputChange}
//                                                                 className="form-control mb-2"
//                                                                 placeholder='Headline'
//                                                                 required
//                                                             />
//                                                             <input
//                                                                 type="text"
//                                                                 name="location"
//                                                                 value={profile.location}
//                                                                 onChange={handleInputChange}
//                                                                 className="form-control"
//                                                                 placeholder='Location'
//                                                                 required
//                                                             />
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <h1 className="mb-2">{profile.fullname}</h1>
//                                                             <h2 className="h4 text-muted mb-2">{profile.headline}</h2>
//                                                             <p className="text-muted mb-0">{profile.location}</p>
//                                                         </>
//                                                     )}
//                                                 </div>
//                                                 <div className="mt-3 mt-md-0 d-flex flex-column flex-sm-row gap-2">
//                                                     <button
//                                                         type={editMode ? "submit" : "button"}
//                                                         className={`btn ${editMode ? 'btn-success' : 'btn-primary'} btn-sm`}
//                                                         style={{
//                                                             backgroundColor: !editMode && '#5D87FF',
//                                                             borderColor: !editMode && '#5D87FF'
//                                                         }}
//                                                         // onClick={!editMode ? (e) => {
//                                                         //     e.preventDefault(); 
//                                                         //     setEditMode(true);
//                                                         // } : undefined}
//                                                         onClick={!editMode ? handleEditClick : undefined}
//                                                         disabled={isSubmitting}
//                                                     >
//                                                         {isSubmitting ? (
//                                                             <>
//                                                                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                                 Saving...
//                                                             </>
//                                                         ) : (
//                                                             <>
//                                                                 <i className="ti ti-user-edit me-2"></i>
//                                                                 {editMode ? 'Save Profile' : 'Edit Profile'}
//                                                             </>
//                                                         )}
//                                                     </button>

//                                                     {!editMode && profile.resume && (
//                                                         <a
//                                                             href={profile.resume ? previewResume : profile.resume?.url}
//                                                             download
//                                                             className="btn btn-sm btn-primary"
//                                                             style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                         >
//                                                             <i className="ti ti-download me-1"></i>
//                                                             Download Resume
//                                                         </a>
//                                                     )}

//                                                     {editMode && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-sm btn-secondary"
//                                                             onClick={() => {
//                                                                 setEditMode(false);
//                                                                 setSubmitMessage({ type: '', text: '' });
//                                                             }}
//                                                             disabled={isSubmitting}
//                                                         >
//                                                             Cancel
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="row">
//                             {/* Sidebar */}
//                             <div className="col-lg-4 mb-4 mb-lg-0">
//                                 {/* Contact Information */}
//                                 <div className="card shadow-sm mb-4">
//                                     <div className="card-body">
//                                         <h3 className="h5 card-title border-bottom pb-3 mb-3">Contact Information</h3>
//                                         {editMode ? (
//                                             <>
//                                                 <div className="mb-3">
//                                                     <label className="form-label">Phone:</label>
//                                                     <input
//                                                         type="tel"
//                                                         name="phone"
//                                                         value={profile.phone}
//                                                         onChange={handleInputChange}
//                                                         className="form-control"
//                                                         required
//                                                     />
//                                                 </div>
//                                                 <div className="mb-3">
//                                                     <label className="form-label">LinkedIn:</label>
//                                                     <input
//                                                         type="text"
//                                                         name="linkedin"
//                                                         value={profile.socialMedia.linkedin}
//                                                         onChange={handleSocialMediaChange}
//                                                         className="form-control"
//                                                     />
//                                                 </div>
//                                                 <div className="mb-3">
//                                                     <label className="form-label">Twitter:</label>
//                                                     <input
//                                                         type="text"
//                                                         name="twitter"
//                                                         value={profile.socialMedia.twitter}
//                                                         onChange={handleSocialMediaChange}
//                                                         className="form-control"
//                                                     />
//                                                 </div>
//                                                 <div className="mb-0">
//                                                     <label className="form-label">Facebook:</label>
//                                                     <input
//                                                         type="text"
//                                                         name="facebook"
//                                                         value={profile.socialMedia.facebook}
//                                                         onChange={handleSocialMediaChange}
//                                                         className="form-control"
//                                                     />
//                                                 </div>
//                                                 <div className="mb-0">
//                                                     <label className="form-label">Github:</label>
//                                                     <input
//                                                         type="text"
//                                                         name="github"
//                                                         value={profile.socialMedia.github}
//                                                         onChange={handleSocialMediaChange}
//                                                         className="form-control"
//                                                     />
//                                                 </div>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <p className="d-flex align-items-center mb-3">
//                                                     <i className="ti ti-phone text-muted me-2"></i>
//                                                     {profile.phone}
//                                                 </p>
//                                                 <p className="d-flex align-items-center mb-3">
//                                                     <i className="ti ti-brand-linkedin text-muted me-2"></i>
//                                                     {profile.socialMedia.linkedin !== "abc" ? profile.socialMedia.linkedin : "Not provided"}
//                                                 </p>
//                                                 <p className="d-flex align-items-center mb-3">
//                                                     <i className="ti ti-brand-twitter text-muted me-2"></i>
//                                                     {profile.socialMedia.twitter !== "abc" ? profile.socialMedia.twitter : "Not provided"}
//                                                 </p>
//                                                 <p className="d-flex align-items-center mb-3">
//                                                     <i className="ti ti-brand-facebook text-muted me-2"></i>
//                                                     {profile.socialMedia.facebook !== "abc" ? profile.socialMedia.facebook : "Not provided"}
//                                                 </p>
//                                                 <p className="d-flex align-items-center mb-0">
//                                                     <i className="ti ti-brand-github text-muted me-2"></i>
//                                                     {profile.socialMedia.github !== "abc" ? profile.socialMedia.github : "Not provided"}
//                                                 </p>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Skills */}
//                                 <div className="card shadow-sm mb-4">
//                                     <div className="card-body">
//                                         <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                             <h3 className="h5 mb-0">Skills</h3>
//                                             {editMode && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-sm btn-primary"
//                                                     style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                     onClick={() => addNewItem('skills', { skills: '' })}
//                                                 >
//                                                     <i className="ti ti-plus"></i>
//                                                 </button>
//                                             )}
//                                         </div>
//                                         <ul className="list-unstyled mb-0">
//                                             {profile.skills.map((skill, index) => (
//                                                 <li key={index} className="mb-2">
//                                                     {editMode ? (
//                                                         <div className="d-flex gap-2 align-items-center mb-2">
//                                                             <input
//                                                                 type="text"
//                                                                 value={skill.skills}
//                                                                 onChange={(e) => handleArrayChange('skills', index, 'skills', e.target.value)}
//                                                                 className="form-control form-control-sm"
//                                                                 required
//                                                             />
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-sm btn-danger"
//                                                                 onClick={() => removeItem('skills', index)}
//                                                             >
//                                                                 <i className="ti ti-x"></i>
//                                                             </button>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="d-flex justify-content-between">
//                                                             <span>{skill.skills}</span>
//                                                         </div>
//                                                     )}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* Personal Information */}
//                                 <div className="card shadow-sm mb-4">
//                                     <div className="card-body">
//                                         <h3 className="h5 card-title border-bottom pb-3 mb-3">Personal Information</h3>
//                                         {editMode ? (
//                                             <>
//                                                 <div className="mb-3">
//                                                     <label htmlFor="age" className="form-label fw-semibold">Gender:</label>
//                                                     <select className="form-select" aria-label="Age" value={profile.gender} onChange={handleInputChange} name='gender'>
//                                                         <option defaultValue value="male" >Male</option>
//                                                         <option value="female">Female</option>
//                                                         <option value="other">Other</option>
//                                                         <option value="prefer not to say">Prefer not to say</option>
//                                                     </select>
//                                                 </div>

//                                                 <div className="mb-4">
//                                                     <label htmlFor="dob" className="form-label fw-semibold">Date of Birth:</label>
//                                                     <input type="date" value={profile.dob || ""} onChange={handleInputChange} name='dob' className="form-control" />
//                                                 </div>
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <div className="d-flex align-items-center mb-3">
//                                                     {profile.gender === "male" ? (
//                                                         <i className="ti ti-gender-male text-muted me-2"></i>
//                                                     ) : profile.gender === "female" ? (
//                                                         <i className="ti ti-gender-female text-muted me-2"></i>
//                                                     ) : profile.gender === "prefer not to say" ? (
//                                                         <i className="ti ti-ban text-muted me-2"></i>
//                                                     ) : (
//                                                         <i className="ti ti-gender-bigender text-muted me-2"></i>
//                                                     )}
//                                                     <p className="mb-0 text-capitalize">
//                                                         {profile.gender ? profile.gender : "Not specified"}
//                                                     </p>
//                                                 </div>

//                                                 <p className="d-flex align-items-center mb-3">
//                                                     <i className="ti ti-calendar text-muted me-2"></i>
//                                                     {/* {profile.age} */}
//                                                     {profile?.age?.years} years, {profile?.age?.months} months, {profile?.age?.days} days
//                                                 </p>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Languages */}
//                                 <div className="card shadow-sm">
//                                     <div className="card-body">
//                                         <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                             <h3 className="h5 mb-0">Languages</h3>
//                                             {editMode && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-sm btn-primary"
//                                                     style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                     onClick={() => addNewItem('languages', { languages: '' })}
//                                                 >
//                                                     <i className="ti ti-plus"></i>
//                                                 </button>
//                                             )}
//                                         </div>
//                                         <ul className="list-unstyled mb-0">
//                                             {profile.languages.map((language, index) => (
//                                                 <li key={index} className="mb-2">
//                                                     {editMode ? (
//                                                         <div className="d-flex gap-2 align-items-center mb-2">
//                                                             <input
//                                                                 type="text"
//                                                                 value={language.languages}
//                                                                 onChange={(e) => handleArrayChange('languages', index, 'languages', e.target.value)}
//                                                                 className="form-control form-control-sm"
//                                                                 required
//                                                             />
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-sm btn-danger"
//                                                                 onClick={() => removeItem('languages', index)}
//                                                             >
//                                                                 <i className="ti ti-x"></i>
//                                                             </button>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="d-flex justify-content-between">
//                                                             <span>{language.languages}</span>
//                                                         </div>
//                                                     )}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Main Content */}
//                             <div className="col-lg-8">
//                                 {/* Navigation */}
//                                 <div className="card shadow-sm mb-4">
//                                     <div className="card-body p-2">
//                                         <ul className="nav nav-pills gap-2">
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'summary' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('summary')}
//                                                 >
//                                                     Summary
//                                                 </button>
//                                             </li>
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'experience' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('experience')}
//                                                 >
//                                                     Experience
//                                                 </button>
//                                             </li>
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'education' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('education')}
//                                                 >
//                                                     Education
//                                                 </button>
//                                             </li>
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'projects' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('projects')}
//                                                 >
//                                                     Projects
//                                                 </button>
//                                             </li>
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'certifications' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('certifications')}
//                                                 >
//                                                     Certifications
//                                                 </button>
//                                             </li>
//                                             <li className="nav-item">
//                                                 <button
//                                                     type="button"
//                                                     className={`btn btn-sm ${activeSection === 'resume' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
//                                                     onClick={() => setActiveSection('resume')}
//                                                 >
//                                                     Resume
//                                                 </button>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {/* Active Section Content */}
//                                 <div className="card shadow-sm">
//                                     <div className="card-body">
//                                         {/* Summary Section */}
//                                         {activeSection === 'summary' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Professional Summary</h3>
//                                                 </div>
//                                                 {editMode ? (
//                                                     <>
//                                                         <textarea
//                                                             name="summary"
//                                                             value={profile.summary}
//                                                             onChange={handleSummaryChange}
//                                                             rows="10"
//                                                             className={`overflow-y-auto form-control ${summaryError ? 'is-invalid' : ''}`}
//                                                             style={{ resize: "none" }}
//                                                             required
//                                                         />
//                                                         <div className="invalid-feedback">{summaryError}</div>
//                                                         <small className="text-muted">{wordCount}/{wordLimit} words</small>

//                                                     </>
//                                                 ) : (
//                                                     <p className="mb-0">{profile.summary}</p>
//                                                 )}
//                                             </div>
//                                         )}

//                                         {/* Experience Section */}
//                                         {activeSection === 'experience' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Work Experience</h3>
//                                                     {editMode && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-sm btn-primary"
//                                                             style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                             onClick={() => addNewItem('experience', {
//                                                                 title: '',
//                                                                 company: '',
//                                                                 location: '',
//                                                                 startDate: '',
//                                                                 endDate: '',
//                                                                 description: ''
//                                                             })}
//                                                         >
//                                                             <i className="ti ti-plus me-1"></i>
//                                                             Add Experience
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                                 {profile.experience.map((exp, index) => (
//                                                     <div key={index} className="mb-4 pb-3 border-bottom">
//                                                         {editMode ? (
//                                                             <div className="bg-light p-3 rounded mb-3">
//                                                                 <div className="row g-3 mb-3">
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Job Title</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={exp.title}
//                                                                             onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Company</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={exp.company}
//                                                                             onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="row g-3 mb-3">
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Location</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={exp.location}
//                                                                             onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <label className="form-label">Start Date</label>
//                                                                         <input
//                                                                             type="date"
//                                                                             value={exp.startDate}
//                                                                             onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
//                                                                             placeholder="YYYY-MM"
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-3">
//                                                                         <label className="form-label">End Date</label>
//                                                                         <input
//                                                                             type="date"
//                                                                             value={exp.endDate}
//                                                                             onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
//                                                                             placeholder="YYYY-MM or Present"
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mb-3">
//                                                                     <label className="form-label">Description</label>
//                                                                     <textarea
//                                                                         value={exp.description}
//                                                                         onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
//                                                                         rows="10"
//                                                                         className="form-control overflow-y-auto "
//                                                                         required
//                                                                         style={{ resize: "none" }}
//                                                                     />

//                                                                 </div>
//                                                                 <button
//                                                                     type="button"
//                                                                     className="btn btn-sm btn-danger"
//                                                                     onClick={() => removeItem('experience', index)}
//                                                                 >
//                                                                     <i className="ti ti-trash me-1"></i>
//                                                                     Remove
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 <h4 className="h5 mb-1">{exp.title}</h4>
//                                                                 <h5 className="h6 text-muted mb-2">{exp.company} • {exp.location}</h5>
//                                                                 <p className="text-muted small mb-2">
//                                                                     {exp.startDate} - {exp.endDate}
//                                                                 </p>
//                                                                 <p className="mb-0">{exp.description}</p>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Education Section */}
//                                         {activeSection === 'education' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Education</h3>
//                                                     {editMode && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-sm btn-primary"
//                                                             style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                             onClick={() => addNewItem('education', {
//                                                                 degree: '',
//                                                                 institution: '',
//                                                                 year: ''
//                                                             })}
//                                                         >
//                                                             <i className="ti ti-plus me-1"></i>
//                                                             Add Education
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                                 {profile.education.map((edu, index) => (
//                                                     <div key={index} className="mb-4 pb-3 border-bottom">
//                                                         {editMode ? (
//                                                             <div className="bg-light p-3 rounded mb-3">
//                                                                 <div className="row g-3">
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Degree</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={edu.degree}
//                                                                             onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Institution</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={edu.institution}
//                                                                             onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-4">
//                                                                         <label className="form-label">Year</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={edu.year}
//                                                                             onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <button
//                                                                     type="button"
//                                                                     className="btn btn-sm btn-danger mt-3"
//                                                                     onClick={() => removeItem('education', index)}
//                                                                 >
//                                                                     <i className="ti ti-trash me-1"></i>
//                                                                     Remove
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 <h4 className="h5 mb-1">{edu.degree}</h4>
//                                                                 <h5 className="h6 text-muted mb-2">{edu.institution}</h5>
//                                                                 <p className="text-muted small mb-0">{edu.year}</p>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Projects Section */}
//                                         {activeSection === 'projects' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Projects</h3>
//                                                     {editMode && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-sm btn-primary"
//                                                             style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                             onClick={() => addNewItem('projects', {
//                                                                 projects: '',
//                                                                 description: '',
//                                                                 year: ''
//                                                             })}
//                                                         >
//                                                             <i className="ti ti-plus me-1"></i>
//                                                             Add Project
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                                 {profile.projects.map((project, index) => (
//                                                     <div key={index} className="mb-4 pb-3 border-bottom">
//                                                         {editMode ? (
//                                                             <div className="bg-light p-3 rounded mb-3">
//                                                                 <div className="row g-3 mb-3">
//                                                                     <div className="col-md-8">
//                                                                         <label className="form-label">Project Name</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={project.projects}
//                                                                             onChange={(e) => handleArrayChange('projects', index, 'projects', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-4">
//                                                                         <label className="form-label">Year</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={project.year}
//                                                                             onChange={(e) => handleArrayChange('projects', index, 'year', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="mb-3">
//                                                                     <label className="form-label">Description</label>
//                                                                     <textarea
//                                                                         value={project.description}
//                                                                         onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
//                                                                         rows="10"
//                                                                         className="form-control overflow-y-auto "
//                                                                         required
//                                                                         style={{ resize: "none" }}
//                                                                     />
//                                                                 </div>
//                                                                 <button
//                                                                     type="button"
//                                                                     className="btn btn-sm btn-danger"
//                                                                     onClick={() => removeItem('projects', index)}
//                                                                 >
//                                                                     <i className="ti ti-trash me-1"></i>
//                                                                     Remove
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 <h4 className="h5 mb-1">{project.projects}</h4>
//                                                                 <p className="text-muted small mb-2">{project.year}</p>
//                                                                 <p className="mb-0">{project.description}</p>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Certifications Section */}
//                                         {activeSection === 'certifications' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Certifications</h3>
//                                                     {editMode && (
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-sm btn-primary"
//                                                             style={{ backgroundColor: '#5D87FF', borderColor: '#5D87FF' }}
//                                                             onClick={() => addNewItem('certifications', {
//                                                                 certificates: '',
//                                                                 issuer: '',
//                                                                 year: ''
//                                                             })}
//                                                         >
//                                                             <i className="ti ti-plus me-1"></i>
//                                                             Add Certification
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                                 {profile.certifications.map((cert, index) => (
//                                                     <div key={index} className="mb-4 pb-3 border-bottom">
//                                                         {editMode ? (
//                                                             <div className="bg-light p-3 rounded mb-3">
//                                                                 <div className="row g-3 mb-3">
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Certification Name</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={cert.certificates}
//                                                                             onChange={(e) => handleArrayChange('certifications', index, 'certificates', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                     <div className="col-md-6">
//                                                                         <label className="form-label">Issuing Organization</label>
//                                                                         <input
//                                                                             type="text"
//                                                                             value={cert.issuer}
//                                                                             onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
//                                                                             className="form-control"
//                                                                             required
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="col-md-4">
//                                                                     <label className="form-label">Year</label>
//                                                                     <input
//                                                                         type="text"
//                                                                         value={cert.year}
//                                                                         onChange={(e) => handleArrayChange('certifications', index, 'year', e.target.value)}
//                                                                         className="form-control"
//                                                                         required
//                                                                     />
//                                                                 </div>
//                                                                 <button
//                                                                     type="button"
//                                                                     className="btn btn-sm btn-danger mt-3"
//                                                                     onClick={() => removeItem('certifications', index)}
//                                                                 >
//                                                                     <i className="ti ti-trash me-1"></i>
//                                                                     Remove
//                                                                 </button>
//                                                             </div>
//                                                         ) : (
//                                                             <>
//                                                                 <h4 className="h5 mb-1">{cert.certificates}</h4>
//                                                                 <h5 className="h6 text-muted mb-2">{cert.issuer}</h5>
//                                                                 <p className="text-muted small mb-0">{cert.year}</p>
//                                                             </>
//                                                         )}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}

//                                         {/* Resume Section */}
//                                         {activeSection === 'resume' && (
//                                             <div>
//                                                 <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
//                                                     <h3 className="h5 mb-0">Resume</h3>
//                                                 </div>

//                                                 {/* If no resume uploaded yet */}
//                                                 {!profile.resume && editMode && (
//                                                     <div>
//                                                         <p>No resume uploaded yet.</p>
//                                                         <label className="btn btn-sm btn-primary mb-0" style={{ cursor: 'pointer' }}>
//                                                             <i className="ti ti-upload me-1"></i> Upload Resume
//                                                             <input
//                                                                 type="file"
//                                                                 accept=".pdf,.doc,.docx"
//                                                                 name='resume'
//                                                                 style={{ display: 'none' }}
//                                                                 onChange={handleFileChangenew}
//                                                             />
//                                                         </label>
//                                                     </div>
//                                                 )}

//                                                 {/* If resume is uploaded */}
//                                                 {profile.resume && (
//                                                     <div className="bg-light p-3 rounded d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
//                                                         <div className="mb-3 mb-md-0">
//                                                             <p className="mb-1"><strong>Uploaded File:</strong></p>
//                                                             <a href={previewResume} target="_blank">View Resume</a>
//                                                         </div>
//                                                         <div className="d-flex gap-2">
//                                                             <a
//                                                                 href={profile.resume ? previewResume : profile.resume?.url}
//                                                                 download
//                                                                 className="btn btn-outline-secondary btn-sm"
//                                                             >
//                                                                 <i className="ti ti-download me-1"></i>
//                                                                 Download
//                                                             </a>

//                                                             {editMode && (
//                                                                 <label className="btn btn-sm btn-primary mb-0" style={{ cursor: 'pointer' }}>
//                                                                     <i className="ti ti-edit me-1"></i> Change Resume
//                                                                     <input
//                                                                         type="file"
//                                                                         accept=".pdf,.doc,.docx"
//                                                                         name='resume'
//                                                                         style={{ display: 'none' }}
//                                                                         onChange={handleFileChangenew}
//                                                                     />
//                                                                 </label>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//             <PasswordCheck
//                 show={showPasswordModal}
//                 onClose={() => setShowPasswordModal(false)}
//                 onVerify={handlePasswordVerify}
//             />
//         </>
//     );
// };

// export default UserProfile;











import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../../context/auth-context';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        profilePicture: null,
        fullname: "",
        gender: "male",
        dob: "",
        headline: "",
        location: "",
        phone: "",
        summary: "",
        experience: [
            {
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                description: ""
            }
        ],
        education: [
            {
                degree: "",
                institution: "",
                year: ""
            }
        ],
        skills: [
            { skills: "" }
        ],
        certifications: [
            {
                certificates: "",
                issuer: "",
                year: ""
            }
        ],
        languages: [
            { languages: "" }
        ],
        projects: [
            {
                projects: "",
                description: "",
                year: ""
            }
        ],
        socialMedia: {
            linkedin: "",
            twitter: "",
            facebook: "",
            github: ""
        },
        resume: null
    });

    const { server, fetchUserData } = useAuthContext()
    const token = localStorage.getItem("token")

    const [editMode, setEditMode] = useState(false);
    const [activeSection, setActiveSection] = useState('summary');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [preview, setPreview] = useState('');
    const [previewResume, setPreviewResume] = useState('');
    const [originalData, setOriginalData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    const getProfile = async () => {
        try {
            const response = await axios.get(`${server}/api/v1/candidate/getprofile`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data.data || {};

            setProfile({
                profilePicture: data.profilePicture || null,
                fullname: data.fullname || "",
                headline: data.headline || "",
                location: data.location || "",
                phone: data.phone || "",
                summary: data.summary || "",
                gender: data.gender || "",
                dob: data.dob || "",
                experience: data.experience || [],
                education: data.education || [],
                skills: data.skills || [],
                certifications: data.certifications || [],
                languages: data.languages || [],
                projects: data.projects || [],
                socialMedia: data.socialMedia || { linkedin: "", twitter: "", facebook: "", github: "" },
                resume: data.resume || null
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch profile');
        }
    };

    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [name]: value
            }
        }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setProfile(prev => {
            const updatedArray = [...prev[arrayName]];
            updatedArray[index] = { ...updatedArray[index], [field]: value };
            return { ...prev, [arrayName]: updatedArray };
        });
    };

    const addNewItem = (arrayName, template) => {
        setProfile(prev => ({
            ...prev,
            [arrayName]: [...prev[arrayName], template]
        }));
    };

    const removeItem = (arrayName, index) => {
        setProfile(prev => ({
            ...prev,
            [arrayName]: prev[arrayName].filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        if (!file) {
            setProfile((prev) => ({ ...prev, [name]: null }));
            setSelectedFile(null);
            return;
        }

        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

        const allowedTypesMap = {
            resume: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
            profilePicture: [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/webp',
            ]
        };

        const allowedTypes = allowedTypesMap[name];

        if (!allowedTypes.includes(file.type)) {
            const errorText =
                name === 'resume'
                    ? 'Only PDF, DOC, and DOCX formats are allowed for resumes.'
                    : 'Only JPG, JPEG, PNG, and WEBP formats are allowed for profile pictures.';

            setMessage({ text: errorText, type: 'error' });
            setProfile((prev) => ({ ...prev, [name]: null }));
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSizeInBytes) {
            setMessage({ text: 'File size should be less than 5MB.', type: 'error' });
            setProfile((prev) => ({ ...prev, [name]: null }));
            setSelectedFile(null);
            return;
        }

        setProfile((prev) => ({ ...prev, [name]: file }));
        setSelectedFile(file);
        setMessage({ text: '', type: '' });
    };

    useEffect(() => {
        const pic = profile.profilePicture;

        if (!pic) {
            setPreview('');
            return;
        }

        if (pic instanceof File) {
            const objectUrl = URL.createObjectURL(pic);
            setPreview(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

        if (typeof pic === 'string') {
            setPreview(pic);
        }
    }, [profile.profilePicture]);

    useEffect(() => {
        const resume = profile.resume;

        if (!resume || !(resume instanceof File)) {
            setPreviewResume('');
            return;
        }

        const objectUrl = URL.createObjectURL(resume);
        setPreviewResume(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [profile.resume]);

    const handleEditClick = () => {
        setMessage({ text: '', type: '' });
        setOriginalData({ ...profile });
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setProfile({ ...originalData });
        setPreview(null);
        setEditMode(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();

            // Append simple fields
            formData.append('fullname', profile.fullname);
            formData.append('headline', profile.headline);
            formData.append('location', profile.location);
            formData.append('phone', profile.phone);
            formData.append('summary', profile.summary);
            formData.append('gender', profile.gender);
            formData.append('dob', profile.dob);

            // Append nested objects (stringify them)
            formData.append('socialMedia', JSON.stringify(profile.socialMedia));

            // Append arrays (stringify them)
            formData.append('experience', JSON.stringify(profile.experience));
            formData.append('education', JSON.stringify(profile.education));
            formData.append('skills', JSON.stringify(profile.skills));
            formData.append('certifications', JSON.stringify(profile.certifications));
            formData.append('languages', JSON.stringify(profile.languages));
            formData.append('projects', JSON.stringify(profile.projects));

            // Append files if they exist
            if (profile.profilePicture) {
                formData.append('profilePicture', profile.profilePicture);
            }
            if (profile.resume) {
                formData.append('resume', profile.resume);
            }

            const response = await axios.post(`${server}/api/v1/candidate/createprofile`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            toast.success('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile. Please try again.'
            });
            toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
            fetchUserData(token)
        }
    };

    const calculateExactAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            // Go back one month
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            // Go back one year
            years--;
            months += 12;
        }

        return { years, months, days };
    };

    useEffect(() => {
        if (profile.dob) {
            const exactAge = calculateExactAge(profile.dob);
            setProfile(prev => ({ ...prev, age: exactAge }));
        }
    }, [profile.dob])

    const wordLimit = 1000;
    const [wordCount, setWordCount] = useState(profile?.summary?.length);
    const [summaryError, setSummaryError] = useState('');

    const handleSummaryChange = (e) => {
        const { value } = e.target;
        const words = value
        const count = words.length;

        if (count <= wordLimit) {
            setProfile(prev => ({ ...prev, summary: value }));
            setWordCount(count);
            setSummaryError('');
        } else {
            setSummaryError(`Maximum ${wordLimit} words allowed.`);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <div className="mb-3 mb-md-0">
                            <h2 className="fw-bold mb-1">Profile Settings</h2>
                            <p className="text-muted mb-0">Manage your personal information and profile details</p>
                        </div>

                        {!editMode && (
                            <button
                                className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                onClick={handleEditClick}
                            >
                                <i className="ti ti-edit"></i>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {message?.text && (
                        <div className={`alert ${message?.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-4`} role="alert">
                            <i className={`ti ${message?.type === 'success' ? 'ti-circle-check' : 'ti-alert-circle-filled'} me-2`}></i>
                            <div>{message.text}</div>
                        </div>
                    )}

                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-lg-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    {/* Profile Picture Section */}
                                    <div className="col-12 col-lg-4">
                                        <div className="d-flex flex-column align-items-center mb-4">
                                            <img
                                                src={preview || profile.profilePicture || 'https://ui-avatars.com/api/?name=' + (profile.fullname || 'User') + '&size=200&background=0D8ABC&color=fff'}
                                                alt="Profile"
                                                className="rounded-circle shadow-sm"
                                                style={{
                                                    width: '200px',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    border: '4px solid #fff'
                                                }}
                                            />

                                            {editMode && (
                                                <>
                                                    <label
                                                        htmlFor="profilePicture"
                                                        className="btn btn-sm btn-primary mt-3"
                                                    >
                                                        Change Picture
                                                        <input
                                                            id="profilePicture"
                                                            type="file"
                                                            name="profilePicture"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="visually-hidden"
                                                        />
                                                    </label>
                                                    <p className="text-muted small mt-1">
                                                        Click above to upload a new picture
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <div className="mt-3 text-center">
                                            <h5 className="fw-semibold mb-1">{profile.fullname || "Your Name"}</h5>
                                            <p className="text-muted small mb-0">{profile.headline}</p>
                                        </div>
                                    </div>

                                    {/* Profile Details Section */}
                                    <div className="col-12 col-lg-8">
                                        <div className="ps-lg-4">
                                            <h4 className="fw-semibold mb-4">Personal Information</h4>

                                            <div className="row g-3">
                                                <div className="col-12">
                                                    <label className="form-label fw-medium text-dark">
                                                        Full Name
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            name="fullname"
                                                            value={profile.fullname}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                            placeholder="Enter your full name"
                                                            required
                                                        />
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.fullname || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label fw-medium text-dark">
                                                        Headline
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            name="headline"
                                                            value={profile.headline}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                            placeholder="Enter your professional headline"
                                                            required
                                                        />
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.headline || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium text-dark">
                                                        Phone Number
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={profile.phone}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                            placeholder="Enter phone number"
                                                            required
                                                        />
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.phone || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium text-dark">
                                                        Location
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            value={profile.location}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                            placeholder="Enter your location"
                                                            required
                                                        />
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.location || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium text-dark">
                                                        Gender
                                                    </label>
                                                    {editMode ? (
                                                        <select
                                                            name="gender"
                                                            value={profile.gender}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                        >
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                            <option value="prefer not to say">Prefer not to say</option>
                                                        </select>
                                                    ) : (
                                                        <div className="p-2 bg-light rounded text-capitalize">
                                                            {profile.gender || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <label className="form-label fw-medium text-dark">
                                                        Date of Birth
                                                    </label>
                                                    {editMode ? (
                                                        <input
                                                            type="date"
                                                            name="dob"
                                                            value={profile.dob}
                                                            onChange={handleInputChange}
                                                            className="form-control form-control-md"
                                                        />
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="col-12">
                                                    <label className="form-label fw-medium text-dark">
                                                        Professional Summary
                                                    </label>
                                                    {editMode ? (
                                                        <>
                                                            <textarea
                                                                name="summary"
                                                                value={profile.summary}
                                                                onChange={handleSummaryChange}
                                                                className={`form-control form-control-md ${summaryError ? 'is-invalid' : ''}`}
                                                                rows="4"
                                                                placeholder="Enter your professional summary"
                                                                required
                                                            />
                                                            {summaryError && <div className="invalid-feedback">{summaryError}</div>}
                                                            <small className="text-muted">{wordCount}/{wordLimit} characters</small>
                                                        </>
                                                    ) : (
                                                        <div className="p-2 bg-light rounded">
                                                            {profile.summary || "Not provided"}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {editMode && (
                                                <div className="mt-4 d-flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-sm btn-primary px-4"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving Changes...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="ti ti-device-floppy me-2"></i>
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-secondary px-4"
                                                        onClick={handleCancelEdit}
                                                        disabled={isSubmitting}
                                                    >
                                                        <i className="ti ti-x me-2"></i>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Work Experience</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('experience', {
                                            title: '',
                                            company: '',
                                            location: '',
                                            startDate: '',
                                            endDate: '',
                                            description: ''
                                        })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Experience
                                    </button>
                                )}
                            </div>
                            {profile.experience.map((exp, index) => (
                                <div key={index} className="mb-4 pb-3 border-bottom">
                                    {editMode ? (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Job Title</label>
                                                <input
                                                    type="text"
                                                    value={exp.title}
                                                    onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Location</label>
                                                <input
                                                    type="text"
                                                    value={exp.location}
                                                    onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.startDate}
                                                    onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">End Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.endDate}
                                                    onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                                                    rows="3"
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('experience', index)}
                                                >
                                                    <i className="ti ti-trash me-1"></i>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h5 className="fw-semibold mb-1">{exp.title}</h5>
                                            <h6 className="text-muted mb-2">{exp.company} • {exp.location}</h6>
                                            <p className="text-muted small mb-2">
                                                {exp.startDate} - {exp.endDate}
                                            </p>
                                            <p className="mb-0">{exp.description}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Education</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('education', {
                                            degree: '',
                                            institution: '',
                                            year: ''
                                        })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Education
                                    </button>
                                )}
                            </div>
                            {profile.education.map((edu, index) => (
                                <div key={index} className="mb-4 pb-3 border-bottom">
                                    {editMode ? (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Degree</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Institution</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Year</label>
                                                <input
                                                    type="text"
                                                    value={edu.year}
                                                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('education', index)}
                                                >
                                                    <i className="ti ti-trash me-1"></i>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h5 className="fw-semibold mb-1">{edu.degree}</h5>
                                            <h6 className="text-muted mb-2">{edu.institution}</h6>
                                            <p className="text-muted small mb-0">{edu.year}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Skills</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('skills', { skills: '' })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Skill
                                    </button>
                                )}
                            </div>
                            <div className="row g-2">
                                {profile.skills.map((skill, index) => (
                                    <div key={index} className="col-md-6">
                                        {editMode ? (
                                            <div className="d-flex gap-2 align-items-center mb-2">
                                                <input
                                                    type="text"
                                                    value={skill.skills}
                                                    onChange={(e) => handleArrayChange('skills', index, 'skills', e.target.value)}
                                                    className="form-control form-control-sm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('skills', index)}
                                                >
                                                    <i className="ti ti-x"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-light rounded mb-2">
                                                {skill.skills}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Projects</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('projects', {
                                            projects: '',
                                            description: '',
                                            year: ''
                                        })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Project
                                    </button>
                                )}
                            </div>
                            {profile.projects.map((project, index) => (
                                <div key={index} className="mb-4 pb-3 border-bottom">
                                    {editMode ? (
                                        <div className="row g-3">
                                            <div className="col-md-8">
                                                <label className="form-label">Project Name</label>
                                                <input
                                                    type="text"
                                                    value={project.projects}
                                                    onChange={(e) => handleArrayChange('projects', index, 'projects', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Year</label>
                                                <input
                                                    type="text"
                                                    value={project.year}
                                                    onChange={(e) => handleArrayChange('projects', index, 'year', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">Description</label>
                                                <textarea
                                                    value={project.description}
                                                    onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                                    rows="3"
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('projects', index)}
                                                >
                                                    <i className="ti ti-trash me-1"></i>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h5 className="fw-semibold mb-1">{project.projects}</h5>
                                            <p className="text-muted small mb-2">{project.year}</p>
                                            <p className="mb-0">{project.description}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Certifications</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('certifications', {
                                            certificates: '',
                                            issuer: '',
                                            year: ''
                                        })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Certification
                                    </button>
                                )}
                            </div>
                            {profile.certifications.map((cert, index) => (
                                <div key={index} className="mb-4 pb-3 border-bottom">
                                    {editMode ? (
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Certification Name</label>
                                                <input
                                                    type="text"
                                                    value={cert.certificates}
                                                    onChange={(e) => handleArrayChange('certifications', index, 'certificates', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Issuing Organization</label>
                                                <input
                                                    type="text"
                                                    value={cert.issuer}
                                                    onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Year</label>
                                                <input
                                                    type="text"
                                                    value={cert.year}
                                                    onChange={(e) => handleArrayChange('certifications', index, 'year', e.target.value)}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('certifications', index)}
                                                >
                                                    <i className="ti ti-trash me-1"></i>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h5 className="fw-semibold mb-1">{cert.certificates}</h5>
                                            <h6 className="text-muted mb-2">{cert.issuer}</h6>
                                            <p className="text-muted small mb-0">{cert.year}</p>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Languages Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-semibold mb-0">Languages</h5>
                                {editMode && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => addNewItem('languages', { languages: '' })}
                                    >
                                        <i className="ti ti-plus me-1"></i>
                                        Add Language
                                    </button>
                                )}
                            </div>
                            <div className="row g-2">
                                {profile.languages.map((language, index) => (
                                    <div key={index} className="col-md-6">
                                        {editMode ? (
                                            <div className="d-flex gap-2 align-items-center mb-2">
                                                <input
                                                    type="text"
                                                    value={language.languages}
                                                    onChange={(e) => handleArrayChange('languages', index, 'languages', e.target.value)}
                                                    className="form-control form-control-sm"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeItem('languages', index)}
                                                >
                                                    <i className="ti ti-x"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-light rounded mb-2">
                                                {language.languages}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <h5 className="fw-semibold mb-4">Social Media</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-dark">
                                        LinkedIn
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={profile.socialMedia.linkedin}
                                            onChange={handleSocialMediaChange}
                                            className="form-control form-control-md"
                                            placeholder="Enter your LinkedIn profile URL"
                                        />
                                    ) : (
                                        <div className="p-2 bg-light rounded">
                                            {profile.socialMedia.linkedin || "Not provided"}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-dark">
                                        Twitter
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="twitter"
                                            value={profile.socialMedia.twitter}
                                            onChange={handleSocialMediaChange}
                                            className="form-control form-control-md"
                                            placeholder="Enter your Twitter profile URL"
                                        />
                                    ) : (
                                        <div className="p-2 bg-light rounded">
                                            {profile.socialMedia.twitter || "Not provided"}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-dark">
                                        Facebook
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="facebook"
                                            value={profile.socialMedia.facebook}
                                            onChange={handleSocialMediaChange}
                                            className="form-control form-control-md"
                                            placeholder="Enter your Facebook profile URL"
                                        />
                                    ) : (
                                        <div className="p-2 bg-light rounded">
                                            {profile.socialMedia.facebook || "Not provided"}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium text-dark">
                                        GitHub
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="github"
                                            value={profile.socialMedia.github}
                                            onChange={handleSocialMediaChange}
                                            className="form-control form-control-md"
                                            placeholder="Enter your GitHub profile URL"
                                        />
                                    ) : (
                                        <div className="p-2 bg-light rounded">
                                            {profile.socialMedia.github || "Not provided"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Section */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <h5 className="fw-semibold mb-4">Resume</h5>
                            {editMode ? (
                                <div>
                                    <label className="form-label fw-medium text-dark">
                                        Upload Resume
                                    </label>
                                    <input
                                        type="file"
                                        name="resume"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="form-control form-control-md"
                                    />
                                    <p className="text-muted small mt-1">
                                        Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    {profile.resume ? (
                                        <div className="d-flex align-items-center gap-3">
                                            <i className="ti ti-file-text text-primary fs-4"></i>
                                            <div>
                                                <p className="mb-0 fw-medium">Resume</p>
                                                <a href={previewResume} target="_blank" rel="noopener noreferrer" className="text-primary">
                                                    View Resume
                                                </a>
                                            </div>
                                            <a
                                                href={previewResume}
                                                download
                                                className="btn btn-sm btn-outline-primary ms-auto"
                                            >
                                                <i className="ti ti-download me-1"></i>
                                                Download
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-muted">No resume uploaded</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Information Card */}
                    <div className="card border-0 shadow-sm mt-4">
                        <div className="card-body p-4">
                            <h5 className="fw-semibold mb-3">Account Information</h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                            <i className="ti ti-user text-primary"></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-0">Account Type</p>
                                            <p className="fw-medium mb-0">Candidate</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                                            <i className="ti ti-check text-success"></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-0">Account Status</p>
                                            <p className="fw-medium mb-0">Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;