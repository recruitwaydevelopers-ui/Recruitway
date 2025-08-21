import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminContext } from '../../../context/superadmin-context';
import formatDateToRelative from '../../../Helper/dateFormatter';

const SuperAdminCompaniesCard = () => {

    const navigate = useNavigate()
    const { isLoading, getAllCompaniesWithJobs, allCompaniesWithTheirJobs } = useSuperAdminContext()

    const [filters, setFilters] = useState({
        search: '',
        industry: 'All',
        location: 'All'
    });

    // Extract unique industries and locations from company and job data
    const industryOptions = [
        'All',
        ...Array.from(
            new Set(
                allCompaniesWithTheirJobs
                    .map(c => c.company.industry)
                    .filter(Boolean)
            )
        )
    ];

    const locationOptions = [
        'All',
        ...Array.from(
            new Set(
                allCompaniesWithTheirJobs.flatMap(c =>
                    c.company.locations?.map(loc => `${loc.city}, ${loc.country}`) || []
                ).filter(Boolean)
            )
        )
    ];

    const filteredCompanies = allCompaniesWithTheirJobs.filter(companyWrapper => {
        const { company } = companyWrapper;

        const companyName = company.fullname?.toLowerCase() || '';
        const companyIndustry = company.industry?.toLowerCase() || '';

        // Format company locations as "City, Country"
        const companyLocations = (company.locations || []).map(loc =>
            `${loc.city}, ${loc.country}`.toLowerCase()
        );

        const selectedLocation = filters.location.toLowerCase();

        // Filters
        const matchesSearch = companyName.includes(filters.search.toLowerCase());
        const matchesIndustry =
            filters.industry === 'All' ||
            companyIndustry === filters.industry.toLowerCase();
        const matchesLocation =
            filters.location === 'All' ||
            companyLocations.includes(selectedLocation);

        return matchesSearch && matchesIndustry && matchesLocation;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        getAllCompaniesWithJobs()
    }, [])

    const handleViewProfile = (companyProfile, Jobs) => {
        navigate('/superadmin/companiesProfile', { state: { companyProfile: companyProfile, jobs: Jobs } });
    };

    const handleViewJobs = (companyId) => {
        navigate(`/superadmin/companiesJobs/${companyId}`);
    };

    if (isLoading) {
        return (
            <>
                <div className="container-fluid">
                    <div className="container py-5">
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container py-5">
                    {/* Header */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <h1 className="mb-3">Featured Companies</h1>
                            <p className="text-muted">
                                Browse through our partner companies and explore career opportunities
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="row mb-4 g-3">
                        {/* Search Box */}
                        <div className="col-12 col-md-12 col-lg-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search companies..."
                                    name="search"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Industry Filter */}
                        <div className="col-6 col-md-6 col-lg-3">
                            <select
                                className="form-select"
                                name="industry"
                                value={filters.industry}
                                onChange={handleFilterChange}
                            >
                                {industryOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option === 'All' ? 'All Industries' : option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div className="col-6 col-md-6 col-lg-3">
                            <select
                                className="form-select"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                            >
                                {locationOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option === 'All' ? 'All Locations' : option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button (visible on mobile) */}
                        <div className="col-12 d-md-none">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => setFilters({
                                    search: '',
                                    industry: 'All',
                                    location: 'All',
                                    size: 'All',
                                    rating: 'All'
                                })}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="row mb-3">
                        <div className="col-12">
                            <p className="text-muted mb-0">
                                Showing {filteredCompanies.length} of {allCompaniesWithTheirJobs.length} companies
                            </p>
                        </div>
                    </div>

                    {/* Companies Grid */}
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {filteredCompanies.length > 0 ? (
                            filteredCompanies.map((company) => (
                                <article key={company.company._id} className="col">
                                    <div className="card h-100 border-0 shadow-lg hover-shadow transition-all overflow-hidden">
                                        <div className="text-center pt-4">
                                            <img
                                                src={company.company.profilePicture || "/images/profile/user-1.jpg"}
                                                alt={`${company.company.fullname} logo`}
                                                className="rounded-circle border border-3 border-primary shadow-sm"
                                                width="90"
                                                height="90"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="card-body text-center">
                                            <h5 className="fw-bold text-primary mb-1">{company.company.fullname}</h5>
                                            <p className="mb-1 text-muted small">
                                                <i className="bi bi-building me-1 text-secondary"></i>
                                                {company.company.industry}
                                            </p>
                                            <p className="mb-1 text-muted small">
                                                <i className="bi bi-envelope me-1 text-secondary"></i>
                                                {company.company.contactEmail}
                                            </p>
                                            <p className="mb-1 text-muted small">
                                                <i className="bi bi-geo-alt-fill text-secondary"></i>
                                                {company.company.headquarters}
                                            </p>
                                            <p className="mb-3 text-muted small">
                                                <i className="bi bi-clock-history me-1 text-secondary"></i>
                                                Last active {formatDateToRelative(company.company.lastActive)}
                                            </p>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    onClick={() => handleViewProfile(company.company, company.jobs)}
                                                    className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                >
                                                    <i className="bi bi-person-lines-fill me-1"></i> Profile
                                                </button>
                                                <button
                                                    onClick={() => handleViewJobs(company?.company?.userId)}
                                                    className="btn btn-primary btn-sm rounded-pill px-3"
                                                >
                                                    <i className="bi bi-briefcase-fill me-1"></i> Jobs
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-12 w-100 mb-5">
                                <div className="card shadow-sm">
                                    <div className="card-body text-center py-5">
                                        <i className="bi bi-building-x display-4 text-muted mb-3"></i>
                                        <h3 className="h4 mb-3">No companies found</h3>
                                        <p className="text-muted mb-4">
                                            Try adjusting your search or filter criteria
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setFilters({
                                                search: '',
                                                industry: 'All',
                                                location: 'All',
                                                size: 'All',
                                                rating: 'All'
                                            })}
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminCompaniesCard;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const SuperAdminCompaniesCard = () => {
//     const [companies, setCompanies] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterIndustry, setFilterIndustry] = useState('All');
//     const navigate = useNavigate();

//     const industries = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Logistics', 'Energy'];

//     useEffect(() => {
//         // Simulate API fetch
//         const fetchCompanies = async () => {
//             try {
//                 // Mock data with more details
//                 const mockCompanies = [
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                     {
//                         id: 1,
//                         name: 'TechSphere Solutions',
//                         logo: 'https://via.placeholder.com/150/007bff/ffffff?text=TS',
//                         cover: 'https://via.placeholder.com/600x200/007bff/ffffff?text=TechSphere',
//                         industry: 'Technology',
//                         location: 'San Francisco, CA',
//                         description: 'Innovative technology solutions for the digital age. We specialize in AI, cloud computing, and cybersecurity.',
//                         jobsCount: 24,
//                         rating: 4.8,
//                         founded: 2015
//                     },
//                     {
//                         id: 2,
//                         name: 'GreenFuture Energy',
//                         logo: 'https://via.placeholder.com/150/28a745/ffffff?text=GF',
//                         cover: 'https://via.placeholder.com/600x200/28a745/ffffff?text=GreenFuture',
//                         industry: 'Energy',
//                         location: 'Austin, TX',
//                         description: 'Pioneering renewable energy solutions for a sustainable tomorrow.',
//                         jobsCount: 15,
//                         rating: 4.6,
//                         founded: 2012
//                     },
//                     {
//                         id: 3,
//                         name: 'UrbanStyle Fashion',
//                         logo: 'https://via.placeholder.com/150/f8f9fa/000000?text=US',
//                         cover: 'https://via.placeholder.com/600x200/f8f9fa/000000?text=UrbanStyle',
//                         industry: 'Retail',
//                         location: 'New York, NY',
//                         description: 'Contemporary fashion for the modern urban lifestyle.',
//                         jobsCount: 8,
//                         rating: 4.2,
//                         founded: 2018
//                     },
//                 ];

//                 setTimeout(() => {
//                     setCompanies(mockCompanies);
//                     setLoading(false);
//                 }, 1000);
//             } catch (err) {
//                 console.error(err);
//                 setLoading(false);
//             }
//         };

//         fetchCompanies();
//     }, []);

//     const filteredCompanies = companies.filter(company => {
//         const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             company.description.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesIndustry = filterIndustry === 'All' || company.industry === filterIndustry;
//         return matchesSearch && matchesIndustry;
//     });

//     if (loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//                 <div className="text-center">
//                     <div className="spinner-grow text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mt-3 text-muted">Loading companies...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="container-fluid">
//                 <div className="container py-5">
//                     {/* Hero Section */}
//                     <div className="container py-4">
//                         <h1 className="display-5 fw-bold mb-3">Discover Top Companies</h1>
//                         <p className="lead mb-4">Find your dream company and explore exciting career opportunities</p>

//                         <div className="row g-3">
//                             <div className="col-md-8">
//                                 <div className="input-group mb-3">
//                                     <span className="input-group-text bg-white border-0">
//                                         <i className="bi bi-search text-muted"></i>
//                                     </span>
//                                     <input
//                                         type="text"
//                                         className="form-control border-0 py-3"
//                                         placeholder="Search companies..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-md-4">
//                                 <select
//                                     className="form-select py-3 border-0"
//                                     value={filterIndustry}
//                                     onChange={(e) => setFilterIndustry(e.target.value)}
//                                 >
//                                     {industries.map(industry => (
//                                         <option key={industry} value={industry}>{industry}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Companies Grid */}
//                     <div className="container py-5">
//                         <div className="row g-4">
//                             {filteredCompanies.length > 0 ? (
//                                 filteredCompanies.map(company => (
//                                     <div key={company.id} className="col-lg-4 col-md-6">
//                                         <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
//                                             <div
//                                                 className="card-img-top bg-dark position-relative"
//                                                 style={{
//                                                     height: '120px',
//                                                     backgroundImage: `url(${company.cover})`,
//                                                     backgroundSize: 'cover',
//                                                     backgroundPosition: 'center'
//                                                 }}
//                                             >
//                                                 <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
//                                                     <img
//                                                         src={company.logo}
//                                                         alt={`${company.name} logo`}
//                                                         className="rounded-circle border border-3 border-white shadow-sm"
//                                                         width="80"
//                                                         height="80"
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="card-body pt-5 text-center">
//                                                 <div className="d-flex justify-content-center align-items-center mb-2">
//                                                     <h5 className="card-title mb-0">{company.name}</h5>
//                                                     <span className="badge bg-success bg-opacity-10 text-success ms-2">
//                                                         <i className="bi bi-star-fill text-warning me-1"></i>
//                                                         {company.rating}
//                                                     </span>
//                                                 </div>
//                                                 <div className="d-flex justify-content-center gap-3 mb-3">
//                                                     <span className="text-muted">
//                                                         <i className="bi bi-geo-alt-fill me-1"></i>
//                                                         {company.location}
//                                                     </span>
//                                                     <span className="text-muted">
//                                                         <i className="bi bi-building me-1"></i>
//                                                         {company.industry}
//                                                     </span>
//                                                 </div>
//                                                 <p className="card-text text-muted mb-4">{company.description}</p>

//                                                 <div className="d-flex flex-column justify-content-between align-items-start gap-3 position-relative">
//                                                     <span className="badge bg-primary bg-opacity-10 text-primary">
//                                                         <i className="bi bi-briefcase me-1"></i>
//                                                         {company.jobsCount} openings
//                                                     </span>
//                                                     <div className="d-flex gap-2 position-absolute bottom-0 right-0">
//                                                         <button
//                                                             onClick={() => navigate(`/superadmin/companiesProfile/${company.id}`)}
//                                                             className="btn btn-sm btn-outline-primary rounded-pill px-3"
//                                                         >
//                                                             View Profile
//                                                         </button>
//                                                         <button
//                                                             onClick={() => navigate(`/superadmin/companiesJobs/${company.id}/jobs`)}
//                                                             className="btn btn-sm btn-primary rounded-pill px-3"
//                                                         >
//                                                             View Jobs
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="col-12 text-center py-5">
//                                     <div className="bg-white rounded-3 p-5 shadow-sm">
//                                         <i className="bi bi-building-x display-1 text-muted mb-4"></i>
//                                         <h3 className="mb-3">No companies found</h3>
//                                         <p className="text-muted mb-4">Try adjusting your search or filter criteria</p>
//                                         <button
//                                             className="btn btn-primary px-4"
//                                             onClick={() => {
//                                                 setSearchTerm('');
//                                                 setFilterIndustry('All');
//                                             }}
//                                         >
//                                             Reset filters
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default SuperAdminCompaniesCard;