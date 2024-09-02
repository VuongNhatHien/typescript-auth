require("dotenv").config();

const db = require("../configs/db");
const User = db.user;
const Wallet = db.wallet;
const Member = db.member;
const UpLevelRequest = db.up_level_request;
const UserWallet = db.user_wallet;

const { formatFilePath, readAndTransformImageToBase64, formatResponse, STATUS_CODE } = require("../utils/services");

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id);
        if (!user)
            return formatResponse(
                res,
                {},
                STATUS_CODE.NOT_FOUND,
                "User not found!"
            );

        user.full_name = req.body.full_name ? req.body.full_name : user.full_name;
        user.description = req.body.description ? req.body.description : user.description;
        user.day_of_birth = req.body.day_of_birth ? req.body.day_of_birth : user.day_of_birth;
        user.phone = req.body.phone ? req.body.phone : user.phone;
        user.avatar = req.file ? formatFilePath(req.file.filename) : user.avatar;

        await user.save();
        const { password, refresh_token, verify_code, ...others } = user.dataValues;

        others.avatar = req.file ? await readAndTransformImageToBase64(user.avatar) : null;

        return formatResponse(
            res,
            {
                user: others
            },
            STATUS_CODE.SUCCESS,
            "Update profile successfully!"
        );
    }
    catch (err) {
        console.log(err.message);
        return formatResponse(
            res,
            {},
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            err.message
        );
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user)
            return formatResponse(
                res,
                {},
                STATUS_CODE.NOT_FOUND,
                "User not found!"
            );

        const { password, refresh_token, verify_code, ...others } = user.dataValues;

        others.avatar = await readAndTransformImageToBase64(user.avatar);

        return formatResponse(
            res,
            {
                user: others
            },
            STATUS_CODE.SUCCESS,
            "Get user successfully!"
        );
    }
    catch (err) {
        console.log(err.message);
        return formatResponse(
            res,
            {},
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            err.message
        );
    }
};

const useWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ where: { id: req.body.global_id } });
        if (wallet) {
            const userWallet = await UserWallet.findOne({where: {user_id: req.user.user_id, wallet_id: wallet.wallet_id}});
            if (userWallet)
                return formatResponse(
                    res,
                    {},
                    STATUS_CODE.BAD_REQUEST,
                    "You have already used this wallet!"
                );

            await Wallet.create({
                global_id: req.body.global_id,
                created_by: req.user.user_id
            });

            return formatResponse(
                res,
                {},
                STATUS_CODE.SUCCESS,
                "Use this wallet successfully!"
            );
        }

        return formatResponse(
            res,
            {},
            STATUS_CODE.NOT_FOUND,
            "Wallet not found!"
        );
    }
    catch (err) {
        console.log(err.message);
        return formatResponse(
            res,
            {},
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            err.message
        );
    }
};

const createWallet = async (req, res) => {
    try {
        const id = Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
        await Wallet.create({
            global_id: id,
            created_by: req.user.user_id
        })
        .then(async (wallet) => {
            await UserWallet.create({
                user_id: req.user.user_id,
                wallet_id: wallet.wallet_id
            });
        })

        return formatResponse(
            res,
            {
                wallet: {
                    global_id: id,
                    created_by: req.user.user_id
                }
            },
            STATUS_CODE.SUCCESS,
            "Create new wallet successfully!"
        );
    }
    catch (err) {
        console.log(err.message);
        return formatResponse(
            res,
            {},
            STATUS_CODE.INTERNAL_SERVER_ERROR,
            err.message
        );
    }
};

// Tín ================================================

const getUpLevelPhase = async (req, res) => {
    try {
        const upLevelPhase = await Member.findOne({
            where: {
                user_id: req.user.user_id,
                community_id: req.params.community_id
            },
            attributes: ["up_level_phase"],
        });

        return formatResponse(res, upLevelPhase, STATUS_CODE.SUCCESS, "Get up level phase successfully!");
    }
    catch (error) {
        return formatResponse(res, {}, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

const createUpLevelRequest = async (req, res) => {
    try {
        const member = await Member.findOne({
            where: {
                user_id: req.user.user_id,
                community_id: req.params.community_id
            },
        });

        if (member.up_level_phase !== 1) {
            return formatResponse(res, {}, STATUS_CODE.FORBIDDEN, "You must be at phase 1 to request up level test!");
        }

        const targetLevel = req.body.target_level;
        const currentLevel = member.current_level;

        console.log(targetLevel, currentLevel);

        if (targetLevel <= currentLevel || targetLevel - currentLevel > 10) {
            return formatResponse(res, {}, STATUS_CODE.BAD_REQUEST, "Target level must > current level and <= current level + 10");
        }

        const upLevelRequest = await UpLevelRequest.create({
            member_id: member.member_id,
            candidate_level: currentLevel,
            candidate_target_level: targetLevel,
        });

        await Member.update({
            current_up_level_request_id: upLevelRequest.up_level_request_id,
            up_level_phase: 2,
        }, {
            where: {
                member_id: member.member_id,
            }
        });

        return formatResponse(
            res, 
            { "up_level_request_id": upLevelRequest.up_level_request_id }, 
            STATUS_CODE.SUCCESS,
             "Create up level request successfully!");
    } catch (error) {
        return formatResponse(res, {}, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

const getCurrentUpLevelRequestId = async (req, res) => {
    try {
        const member = await Member.findOne({
            where: {
                user_id: req.user.user_id,
                community_id: req.params.community_id
            },
        });

        const upLevelRequest = await UpLevelRequest.findOne({
            where: {
                up_level_request_id: member.current_up_level_request_id,
            },
        });

        if (!upLevelRequest) {
            return formatResponse(res, {}, STATUS_CODE.NOT_FOUND, "You don't have any current level request!");
        }

        return formatResponse(res, upLevelRequest, STATUS_CODE.SUCCESS, "Get current level request successfully!");
    } catch (error) {
        return formatResponse(res, {}, STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
    }
};

// ===================================================

module.exports = {
    updateUser,
    getUser,
    useWallet,
    createWallet,
    getUpLevelPhase,
    createUpLevelRequest,
    getCurrentUpLevelRequestId,
}