DROP FUNCTION reg_user;
CREATE OR REPLACE FUNCTION REG_USER(
	LOGIN VARCHAR(80),
	PASS CHAR(64),
	NAME VARCHAR(80),
	EMAIL VARCHAR(80)
) RETURNS bool
AS $$

DECLARE
	_id int;
	_pass CHAR(64);
	_date_time timestamptz;

BEGIN 
	SELECT LAST_ID FROM ID_COUNTER INTO _ID;
	SELECT _ID + 1 INTO _ID;
	SELECT MD5($2) INTO _PASS;
	SELECT CURRENT_TIMESTAMP INTO _DATE_TIME;

	IF (
		select exists (
			SELECT * FROM USERS WHERE USERS.LOGIN = $1 OR USERS.EMAIL = $4
		)	
	)
	THEN 
		RAISE EXCEPTION 'Erorr' USING HINT = 'User already exists';
	END IF;
	
	INSERT INTO USERS (id, login, display_name, pswd_md5, email, create_date_time)
    VALUES(_ID, $1, $3, _PASS, $4, _DATE_TIME);
	
	UPDATE id_counter SET last_id = _id WHERE id_counter.last_id = (_id - 1);
	
	return true;

END
	$$ LANGUAGE PLPGSQL;