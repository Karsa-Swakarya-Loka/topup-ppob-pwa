/**
 * Game Nickname Checker API
 * Memvalidasi apakah User ID & Server ID game valid dan mengembalikan nama akun game
 */

export interface NicknameCheckResult {
  valid: boolean;
  nickname?: string;
  gameSlug: string;
  userId: string;
  zoneId?: string;
  message?: string;
}

export async function checkGameNickname(
  gameSlug: string,
  userId: string,
  zoneId?: string
): Promise<NicknameCheckResult> {
  // Simulasi cek network delay 600ms
  await new Promise((res) => setTimeout(res, 600));

  if (!userId || userId.trim().length < 3) {
    return {
      valid: false,
      gameSlug,
      userId,
      message: "User ID terlalu pendek",
    };
  }

  // Format respons nickname sesuai game
  if (gameSlug === "mobile-legends") {
    if (!zoneId) {
      return {
        valid: false,
        gameSlug,
        userId,
        message: "Zone ID wajib diisi untuk Mobile Legends (cth: 2172)",
      };
    }
    // Nickname generator simulasi
    const prefixes = ["RRQ", "ONIC", "EVOS", "BTR", "AlterEgo", "Sultan", "MythicGlory"];
    const names = ["Lemon", "Kairi", "Sanz", "Skylar", "Alberttt", "GamerPro", "KaguraKing"];
    const randP = prefixes[Math.abs(userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % prefixes.length];
    const randN = names[Math.abs((zoneId || "").split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % names.length];

    return {
      valid: true,
      nickname: `${randP} ${randN}`,
      gameSlug,
      userId,
      zoneId,
    };
  }

  if (gameSlug === "free-fire") {
    const ffNames = ["EVOS_SAM13", "RUOK_999", "BTR_KRAZYY", "SULTAN_BOOYAH", "HEADSHOT_KING"];
    const name = ffNames[Math.abs(userId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % ffNames.length];
    return {
      valid: true,
      nickname: name,
      gameSlug,
      userId,
    };
  }

  if (gameSlug === "genshin-impact") {
    return {
      valid: true,
      nickname: `Traveler_${userId.slice(-4)} (AR 58)`,
      gameSlug,
      userId,
      zoneId,
    };
  }

  if (gameSlug === "valorant") {
    return {
      valid: true,
      nickname: userId.includes("#") ? userId : `${userId}#ID1`,
      gameSlug,
      userId,
    };
  }

  return {
    valid: true,
    nickname: `Gamer_${userId.slice(-4)}`,
    gameSlug,
    userId,
    zoneId,
  };
}
