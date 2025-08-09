import React, { useState } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { BsCart3 } from "react-icons/bs";
import { FaMapLocation } from "react-icons/fa6";
import { MdVideoCall } from "react-icons/md";
import { RxSpeakerLoud } from "react-icons/rx";
import { GrAttachment } from "react-icons/gr";

const ModalContentList = ({ item, index, handleInputChange, handleAddContent }) => {
  const [buttons, setButtons] = useState([]);
  const [formData, setFormData] = useState({
    profilePicture: '',
  });
  const [cardButtons, setCardButtons] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleAddCardButton = () => {
    setCardButtons((prev) => [...prev, `Button ${prev.length + 1}`]);
  };

  // const handleAddButton = () => {
  //   setButtons((prevButtons) => [...prevButtons, `Button ${prevButtons.length + 1}`]);
  // };
  const handleAddButton = () => {
    const newButtons = [...(item.buttons || []), `Button ${(item.buttons?.length || 0) + 1}`];
    handleInputChange(index, { ...item, buttons: newButtons });
  };
  
  const handleMediaUpload = async (e, mediaType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL for images and videos
    let previewUrl = null;
    if (mediaType === 'image' || mediaType === 'video') {
      previewUrl = URL.createObjectURL(file);
      handleInputChange(index, previewUrl);
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://backendv2.botnflow.com/v2/helper/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 200) {
        const data = await res.json();
        if (Array.isArray(data.files) && data.files[0]?.url) {
          const permanentUrl = data.files[0].url;
          handleInputChange(index, permanentUrl);
          alert(`${mediaType} uploaded successfully`);

          // Clean up preview URL if we created one
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        } else {
          console.error("Invalid response from upload API:", data);
        }
      } else {
        throw new Error(`Upload failed with status ${res.status}`);
      }
    } catch (error) {
      console.error(`${mediaType} upload failed:`, error);
      alert(`Failed to upload ${mediaType}`);
    }
  };

  const renderMediaPreview = (file) => {
    if (!file) return null;

    if (typeof file === 'string') {
      // Handle URL strings (could be image, video, or other file)
      if (file.match(/\.(jpeg|jpg|gif|png)$/)) {
        return (
          <img
            src={file}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
          />
        );
      } else if (file.match(/\.(mp4|webm|ogg)$/)) {
        return (
          <video
            controls
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
          >
            <source src={file} type={`video/${file.split('.').pop()}`} />
          </video>
        );
      }
      return (
        <div style={{ textAlign: 'center' }}>
          <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "gray" }} />
          <div>Uploaded File</div>
        </div>
      );
    } else if (file instanceof File || file instanceof Blob) {
      // Handle File objects
      const url = URL.createObjectURL(file);
      if (file.type.startsWith('image/')) {
        return (
          <img
            src={url}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
            onLoad={() => URL.revokeObjectURL(url)}
          />
        );
      } else if (file.type.startsWith('video/')) {
        return (
          <video
            controls
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px" }}
          >
            <source src={url} type={file.type} />
          </video>
        );
      }
      return (
        <div style={{ textAlign: 'center' }}>
          <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "gray" }} />
          <div>{file.name || 'Uploaded File'}</div>
        </div>
      );
    }
    return null;
  };

  switch (item.type) {
    case 'WhatsApp Flows':
    case 'Text':
    case 'Inbox':
      return (
        <div style={{ width: "83%", textAlign: 'center', minHeight: "130px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden", paddingBottom: '10px' }}>
          <input
            type="text"
            value={item.value || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter text here"
            style={{ backgroundColor: "#E3E6EB", padding: "20px 5px", width: "100%", border: "none", outline: "none" }}
          />

          {/* {buttons.map((button, btnIndex) => (
            <button
              key={btnIndex}
              style={{
                width: "80%",
                padding: "11px",
                margin: "10px auto",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#E3E6E7",
                display: "block"
              }}
            >
              {button}
            </button>
          ))} */}
          {item.buttons.map((button, btnIndex) => (
            <button
              key={btnIndex}
              style={{
                width: "80%",
                padding: "11px",
                margin: "10px auto",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#E3E6E7",
                display: "block"
              }}
            >
              {button}
            </button>
          ))}

          <button
            style={{
              width: "80%",
              padding: "11px",
              margin: "10px auto",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#E3E6E7",
              display: "block"
            }}
            onClick={handleAddButton}
          >
            + Add Button
          </button>
        </div>
      );

    case 'Image':
    case 'Audio':
    case 'Video': {
      const isImage = item.type === 'Image';
      const isVideo = item.type === 'Video';
      return (
        <div
          style={{
            border: "1px dashed lightgray",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            width: "82%",
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
            margin: "20px auto",
            position: "relative",
          }}
        >
          {item.value ? (
            renderMediaPreview(item.value)
          ) : (
            <>
              <input
                type="file"
                accept={isImage ? "image/*" : isVideo ? "video/*" : "audio/*"}
                onChange={(e) => handleMediaUpload(e, isImage ? 'image' : isVideo ? 'video' : 'audio')}
                style={{
                  opacity: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  cursor: "pointer",
                }}
              />

              <div style={{ textAlign: "center", pointerEvents: "none" }}>
                {isImage ? (
                  <CiImageOn style={{ fontSize: "31px", marginBottom: "28px", color: "gray" }} />
                ) : isVideo ? (
                  <MdVideoCall style={{ fontSize: "47px", marginBottom: "15px", color: "gray" }} />
                ) : (
                  <RxSpeakerLoud style={{ fontSize: "27px", marginBottom: "15px", color: "gray" }} />
                )}
                <div><a href="#">Upload {item.type}</a></div>
              </div>
            </>
          )}
        </div>
      );
    }

    case 'Crousel':
    case 'Card':
      return (
        <div style={{
          border: "1px dashed gray",
          borderRadius: "8px",
          textAlign: "center",
          height: "250px",
          width: "80%",
          boxSizing: "border-box",
          backgroundColor: "#fff",
          cursor: "pointer",
          margin: "30px auto",
          overflow: "hidden",
          marginTop: "10px",
          position: "relative"
        }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "50%",
              width: "100%",
              cursor: "pointer",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => document.getElementById(`file-input-${index}`).click()}
          >
            {item.value ? (
              renderMediaPreview(item.value)
            ) : (
              <>
                <CiImageOn style={{ margin: "18px 0px", fontSize: "31px" }} />
                <div><a href="#">Upload Image</a></div>
              </>
            )}
          </div>
          <input
            type="file"
            id={`file-input-${index}`}
            accept="image/*"
            onChange={(e) => {
              // const file = e.target.files[0];
              // if (file) {
              handleMediaUpload(e, 'image');
              // }
            }}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              cursor: "pointer"
            }}
          />
          <div style={{
            textAlign: "center",
            backgroundColor: "#F2F4F5",
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: "10px 0"
          }}>
            <div style={{ width: "100%" }}>
              <input
                type="text"
                placeholder="Title (Required)"
                value={item.title || ''}
                onChange={(e) => {
                  const updatedItem = { ...item, title: e.target.value };
                  handleInputChange(index, updatedItem);
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  marginBottom: "2px",
                  boxSizing: "border-box",
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                  fontSize: "13px",
                }}
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={item.subtitle || ''}
                onChange={(e) => {
                  const updatedItem = { ...item, subtitle: e.target.value };
                  handleInputChange(index, updatedItem);
                }}
                style={{
                  width: "100%",
                  padding: "5px",
                  boxSizing: "border-box",
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                  fontSize: "13px",
                }}
              />

              {cardButtons.map((button, btnIndex) => (
                <button
                  key={btnIndex}
                  style={{
                    margin: "10px auto",
                    padding: "8px 16px",
                    backgroundColor: "#E4E6E7",
                    color: "black",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    display: "block",
                    width: "90%"
                  }}
                >
                  {button}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddCardButton}
              style={{
                margin: "10px auto",
                padding: "8px 16px",
                backgroundColor: "#E4E6E7",
                color: "black",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                display: "block",
                width: "90%"
              }}
            >
              + Add Button
            </button>
          </div>
        </div>
      );

    case 'Get User Data':
      return (
        <div>
          <div style={{ width: "83%", minHeight: "50px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden" }}>
            <input
              type="text"
              value={item.value || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder="Enter text here"
              style={{ backgroundColor: "#E3E6EB", padding: "20px 5px", width: "100%", border: "none", outline: "none" }}
            />
          </div>
          <button style={{ width: "60px", padding: "8px", margin: "0px 130px", borderRadius: "23px", border: "1px solid gray" }}>Edit</button>
        </div>
      );

    case 'File':
      return (
        <div style={{ width: "83%", minHeight: "140px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden", paddingBottom: "10px" }}>
          <div style={{
            backgroundColor: "#E3E6EB",
            padding: "20px 5px",
            width: "100%",
            border: "none",
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {item.value ? (
              renderMediaPreview(item.value)
            ) : (
              <>
                <input
                  type="file"
                  onChange={(e) => handleMediaUpload(e, 'file')}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    left: 0,
                    height: "60px",
                    width: "83%",
                    cursor: "pointer"
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "gray" }} />
                  <div>Upload File</div>
                </div>
              </>
            )}
          </div>
          {buttons.map((button, btnIndex) => (
            <button
              key={btnIndex}
              style={{
                width: "80%",
                padding: "11px",
                margin: "10px auto",
                border: "none",
                borderRadius: "4px",
                backgroundColor: "#E3E6E7",
                display: "block"
              }}
            >
              {button}
            </button>
          ))}

          <button
            style={{
              width: "80%",
              padding: "11px",
              margin: "10px auto",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#E3E6E7",
              display: "block"
            }}
            onClick={handleAddButton}
          >
            + Add Button
          </button>
        </div>
      );

    case 'Options List':
    case 'Template Message Pro':
    case 'Typing Pro':
    case 'Actions':
    case 'View Catalog':
    case 'ViewCatalog':
    case 'WhatsAppFlows': {
      const isViewCatalogWithSpace = item.type === 'View Catalog';
      const isViewCatalogNoSpace = item.type === 'ViewCatalog';
      const isWhatsAppFlows = item.type === 'WhatsAppFlows';

      const width = "83%";
      const buttonText = isViewCatalogWithSpace
        ? "+ Add Catalog"
        : isViewCatalogNoSpace
          ? "View Catalog"
          : "button # 1";

      return (
        <div
          style={{
            width,
            textAlign: "center",
            minHeight: "130px",
            backgroundColor: "#F2F4F5",
            borderRadius: "13px",
            margin: "20px auto",
            overflow: "hidden",
            paddingBottom: "10px",
          }}
        >
          <input
            type="text"
            value={item.value || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter text here"
            style={{
              backgroundColor: "#E3E6EB",
              padding: "20px 5px",
              width: "100%",
              border: "none",
              outline: "none",
            }}
          />

          <button
            style={{
              width: "80%",
              padding: "11px",
              margin: "10px auto",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#E3E6E7",
              display: "block",
            }}
            onClick={() => handleAddContent(index, item.type)}
          >
            {buttonText}
          </button>
        </div>
      );
    }

    case 'Send Products':
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px", gap: "10px" }}>
          <BsCart3 style={{ color: "darkorange" }} />
          <span>Send Products</span>
        </div>
      );

    case 'Location':
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px", gap: "10px" }}>
          <FaMapLocation style={{ color: "darkorange" }} />
          <span>Location</span>
        </div>
      );

    case 'Others':
      return (
        <div style={{
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "150px",
          width: "82%",
          backgroundColor: "#f5f5f5",
          cursor: "pointer",
          border: "1px dashed lightgray",
          margin: "20px auto",
          position: "relative"
        }}>
          <input
            type="file"
            accept="image/*,video/*,audio/*,application/pdf"
            onChange={(e) => handleInputChange(index, e.target.files[0])}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              cursor: "pointer"
            }}
          />
          <div style={{ textAlign: "center", pointerEvents: "none" }}>
            <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "lightgray" }} />
            <div><a href="#">Upload File</a></div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default ModalContentList;