import express from 'express'
import multer from 'multer'


//multer for
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
   
    cb(null, file.originalname)
  }
})

export const upload = multer({storage,})