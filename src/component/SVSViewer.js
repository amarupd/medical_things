import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import axios from "axios";

// Import images from assets
import img1 from "../assets/1.jpeg";
import img2 from "../assets/2.jpeg";
import img3 from "../assets/3.jpeg";
import img4 from "../assets/4.jpeg";
import img5 from "../assets/5.jpeg";
import img6 from "../assets/6.jpeg";
import img7 from "../assets/7.jpeg";
import img8 from "../assets/8.jpeg";

const images = [img1, img2, img3, img4, img5, img6, img7, img8];

const API_BASE = "https://demo.kitware.com/histomicstk/api/v1";
const ITEM_ID = "5c74528be62914004b10fd1e";

const SVSViewer = () => {
    const viewerRef = useRef(null);
    const osdViewer = useRef(null);
    const [tileInfo, setTileInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isTreeOpen, setIsTreeOpen] = useState(false);
    const [isThumbnailsOpen, setIsThumbnailsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");

    useEffect(() => {
        const fetchTileData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/item/${ITEM_ID}/tiles`);
                setTileInfo(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to load image metadata.");
            } finally {
                setLoading(false);
            }
        };
        fetchTileData();
    }, []);

    useEffect(() => {
        if (tileInfo && viewerRef.current && !osdViewer.current) {
            osdViewer.current = OpenSeadragon({
                element: viewerRef.current,
                prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
                crossOriginPolicy: "Anonymous",
                tileSources: {
                    width: tileInfo.sizeX,
                    height: tileInfo.sizeY,
                    tileSize: tileInfo.tileWidth,
                    minLevel: 0,
                    maxLevel: tileInfo.levels - 1,
                    getTileUrl: (level, x, y) => `${API_BASE}/item/${ITEM_ID}/tiles/zxy/${level}/${x}/${y}`,
                },
                showNavigator: true,
                showRotationControl: true,
                maxZoomPixelRatio: 10,
            });
        }
        return () => {
            if (osdViewer.current) {
                osdViewer.current.destroy();
                osdViewer.current = null;
            }
        };
    }, [tileInfo]);

    const totalPages = Math.ceil(images.length / itemsPerPage);
    const paginatedImages = images.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container">
            {/* ✅ Added Navbar Here */}
            <nav className="navbar">
                <div className="navbar-title">
                    <h1>Trilok Sir</h1>
                </div>

            </nav>

            <aside className={`sidebar ${isSidebarOpen ? "expanded" : "collapsed"}`}>
                <div className="sidebar-header" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <span className="sidebar-label">SLIDES</span>
                    <button className="toggle-btn">{isSidebarOpen ? "🔙" : "➕"}</button>
                </div>
                {isSidebarOpen && (
                    <>
                        <div className="sidebar-section">
                            <div className="sidebar-header" onClick={() => setIsTreeOpen(!isTreeOpen)}>
                                <span className="sidebar-label">TREE</span>
                                <button className="toggle-btn">{isTreeOpen ? "▲" : "▼"}</button>
                            </div>
                            {isTreeOpen && (
                                <div className="tree-content">
                                    <ul className="tree-list">
                                        <li>📁 acc</li>
                                        <li>📁 blca</li>
                                        <li>📁 brca</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="sidebar-section">
                            <div className="sidebar-header" onClick={() => setIsThumbnailsOpen(!isThumbnailsOpen)}>
                                <span className="sidebar-label">THUMBNAILS</span>
                                <button className="toggle-btn">{isThumbnailsOpen ? "▲" : "▼"}</button>
                            </div>
                            {isThumbnailsOpen && (
                                <>
                                    {/* Dropdown Menus */}
                                    <div className="dropdown-container">
                                        <select className="dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                            <option value="All">All Categories</option>
                                            <option value="Category 1">Category 1</option>
                                            <option value="Category 2">Category 2</option>
                                        </select>

                                        <select className="dropdown" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                            <option value="All">All Types</option>
                                            <option value="Type A">Type A</option>
                                            <option value="Type B">Type B</option>
                                        </select>
                                    </div>
                                    <div className="thumbnail-grid">
                                        {paginatedImages.map((image, index) => (
                                            <div key={index} className="thumbnail">
                                                <img src={image} alt={`Slide ${index + 1}`} className="thumbnail-image" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pagination">
                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ⬅ Prev
                                        </button>
                                        <span>{currentPage} / {totalPages}</span>
                                        <button
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next ➡
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </aside>

            <main className="viewer-section">
                <div className="viewer-header">
                    <div className="button-group">
                        <button className="btn btn-blue">Metadata</button>
                        <button className="btn btn-gray">Filters</button>
                        <button className="btn btn-green">Pathology Report</button>
                        <button className="btn btn-gray">Aperio Annotations</button>
                    </div>
                </div>
                {loading && <p className="loading">Loading...</p>}
                {error && <p className="error">{error}</p>}
                <div ref={viewerRef} id="openseadragon-viewer"></div>
            </main>
        </div>
    );
};

export default SVSViewer;
