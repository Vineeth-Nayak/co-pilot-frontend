// components/EditorComponents.js
import React from "react";
import styled from "styled-components";

export const Button = styled.span`
  cursor: pointer;
  color: ${(props) => (props.active ? "black" : "#ccc")};
  margin-right: 10px;
`;

export const Icon = styled.span`
  font-size: 18px;
`;

export const Toolbar = styled.div`
  border-bottom: 2px solid #eee;
  background: #f8f8f8;
  padding: 10px;
  margin-bottom: 10px;
`;
