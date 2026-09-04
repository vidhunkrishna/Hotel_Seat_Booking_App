import {
  AddTable,
  GetTables,
  GetTableById,
  PatchTable,
  DeleteTable,
} from "../services/table.service.js";

export const addtables = async (req, res) => {
  try {
    const data = await AddTable(
      req.user.userId,
      req.user.role,
      req.params.hotelId,
      req.body,
    );
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getTables = async (req, res) => {
  const data = await GetTables(req.params.hotelId);
  res.status(200).json(data);
};

export const getTablebyId = async (req, res) => {
  const data = await GetTableById(req.params.id);
  res.status(200).json(data);
};

export const patchTable = async (req, res) => {
  const data = await PatchTable(
    req.user.userId,
    req.user.role,
    req.params.id,
    req.body,
  );

  res.status(200).json(data);
};

export const deleteTable = async (req, res) => {
  const data = await DeleteTable(req.user.userId, req.user.role, req.params.id);

  res.status(200).json(data);
};
