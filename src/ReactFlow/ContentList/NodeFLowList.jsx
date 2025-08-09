import { useCallback } from 'react';
import { CiImageOn } from 'react-icons/ci';
import { BsCart3 } from "react-icons/bs";
import { FaMapLocation } from "react-icons/fa6";
import { MdVideoCall } from "react-icons/md";
import { ContentContext } from '../../Context/ContentContext';
import { useContext } from 'react';
import { RxSpeakerLoud } from "react-icons/rx";
import { GrAttachment } from "react-icons/gr";
import { Handle } from '@xyflow/react';

const NodeFLowList = ({ item, index, nodeId, handleAddContent }) => {
  const { setContentForNode, getContentForNode } = useContext(ContentContext);

  const handleInputChange = (index, value) => {
    const updatedContent = [...getContentForNode(nodeId)];
    updatedContent[index] = { ...updatedContent[index], value };
    setContentForNode(nodeId, updatedContent);
  };

  const handleFileChange = useCallback((e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedContent = [...getContentForNode(nodeId)];
      updatedContent[index] = {
        ...updatedContent[index],
        value: file,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified
        }
      };
      setContentForNode(nodeId, updatedContent);
    }
  }, [getContentForNode, nodeId, setContentForNode]);

  const renderImagePreview = (file) => {
    if (!file) return null;

    if (typeof file === 'string') {
      return (
        <img
          src={file}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '8px',
            objectFit: 'contain'
          }}
        />
      );
    } else if (file instanceof File || file instanceof Blob) {
      // If it's a File object, create object URL
      const url = URL.createObjectURL(file);
      return (
        <img
          src={url}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: '8px',
            objectFit: 'contain'
          }}
        />
      );
    } else if (file.isFile) {
      // If it's a file object from localStorage
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
        <div style={{ width: "93%", minHeight: "60px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden" }}>
          <input
            type="text"
            value={item.value || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter text here"
            style={{ backgroundColor: "#E3E6EB", padding: "20px 5px", width: "100%", border: "none", outline: "none" }}
          />
          {item.buttons?.map((button, btnIndex) => (
            <button
              key={btnIndex}
              style={{
                width: "95%",
                padding: "11px",
                margin: "10px auto",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#E3E6E7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span>{button}</span>
              <Handle
                className='text-button-handler'
                type="source"
                id={`text-button-${nodeId}-${index}-${btnIndex}`}
                position="right"
                isConnectable={true}
                style={{
                  position: 'relative',
                  top: '8px',
                  right: '5px',
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'gray',
                  flexShrink: 0
                }}
              />
            </button>
          ))}
        </div>
      );

    case 'Image':
    case 'Audio':
    case 'Video': {
      const isImage = item.type === 'Image';
      const isVideo = item.type === 'Video';
      const isAudio = item.type === 'Audio';

      const icon = isImage ? (
        <CiImageOn style={{ fontSize: "38px", marginBottom: "12px", color: "lightgray" }} />
      ) : isVideo ? (
        <MdVideoCall style={{ fontSize: "42px", marginBottom: "12px", color: "lightgray" }} />
      ) : (
        <RxSpeakerLoud style={{ fontSize: "36px", marginBottom: "12px", color: "lightgray" }} />
      );

      const width = isImage ? "93%" : isVideo ? "95%" : "92%";

      return (
        <div
          style={{
            border: "1px dashed lightgray",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "150px",
            width,
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
            margin: "20px auto",
            position: "relative",
          }}
          onClick={() => document.getElementById(`file-input-${nodeId}-${index}`).click()}
        >
          <input
            type="file"
            id={`file-input-${nodeId}-${index}`}
            accept={isImage ? "image/*" : isVideo ? "video/*" : "audio/*"}
            onChange={(e) => handleFileChange(e, index)}
            style={{ display: 'none' }}
          />
          {item.value ? (
            renderImagePreview(item.value)
          ) : (
            <div style={{ textAlign: "center", pointerEvents: "none" }}>
              {icon}
              <div><a href="#">Upload {item.type}</a></div>
            </div>
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
          height: "160px",
          width: "92%",
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
            onClick={() => document.getElementById(`file-input-${nodeId}-${index}`).click()}
          >
            <input
              type="file"
              id={`file-input-${nodeId}-${index}`}
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              style={{ display: 'none' }}
            />
            {item.value ? (
              renderImagePreview(item.value)
            ) : (
              <>
                <CiImageOn style={{ margin: "18px 0px", fontSize: "38px", color: "lightgray" }} />
                <div><a href="#">Upload Image</a></div>
              </>
            )}
          </div>
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
                  const updatedContent = [...getContentForNode(nodeId)];
                  updatedContent[index] = { ...updatedContent[index], title: e.target.value };
                  setContentForNode(nodeId, updatedContent);
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
                  pointerEvents: "auto"
                }}
              />
            </div>
          </div>
        </div>
      );

    case 'Get User Data':
      return (
        <div style={{ width: "93%", minHeight: "40px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden" }}>
          <input
            type="text"
            value={item.value || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter text here"
            style={{ backgroundColor: "#E3E6EB", padding: "12px 5px", width: "100%", border: "none", outline: "none" }}
          />
        </div>
      );

    case 'File':
      return (
        <div style={{ width: "83%", minHeight: "140px", backgroundColor: "#F2F4F5", borderRadius: "13px", margin: "20px auto", overflow: "hidden" }}>
          <div
            style={{
              backgroundColor: "#E3E6EB",
              padding: "20px 5px",
              width: "100%",
              border: "none",
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById(`file-input-${nodeId}-${index}`).click()}
          >
            <input
              type="file"
              id={`file-input-${nodeId}-${index}`}
              onChange={(e) => handleFileChange(e, index)}
              style={{ display: 'none' }}
            />
            {item.value ? (
              renderImagePreview(item.value)
            ) : (
              <div style={{ textAlign: 'center' }}>
                <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "gray" }} />
                <div>Upload File</div>
              </div>
            )}
          </div>
          <button style={{ width: "80%", padding: "11px", margin: "30px", border: "none", borderRadius: "4px", backgroundColor: "#E3E6E7" }}>
            + Add Button
          </button>
        </div>
      );

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
            placeholder="Enter text here"
            style={{
              backgroundColor: "#E3E6EB",
              padding: "20px 5px",
              width: "100%",
              border: "none",
              outline: "none",
            }}
            value={item.value || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
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

    case 'Options List':
    case 'Template Message Pro':
    case 'Typing Pro':
    case 'Actions':
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
          <div style={{ textAlign: "center" }}>
            <GrAttachment style={{ fontSize: "30px", marginBottom: "12px", color: "lightgray" }} />
            <div><a href="#">Upload File</a></div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default NodeFLowList;