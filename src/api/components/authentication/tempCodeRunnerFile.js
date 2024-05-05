if (logcount === 5) {
      const date = new Date();
      date.getTime().toString();
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        `[${date}] User ${email} gagal login. Attempt = ${logcount}. Limit Reached`
      );
    }