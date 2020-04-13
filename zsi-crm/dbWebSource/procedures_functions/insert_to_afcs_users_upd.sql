CREATE PROCEDURE insert_to_afcs_users_upd 
AS
BEGIN
  INSERT INTO zsi_afcs.dbo.users select 'lmdo', concat(last_name,', ',first_name,dbo.isNotNull(middle_name,concat(' ',substring(middle_name,1,1),'.'))), emp_hash_key, dbo.getPositionDesc(position_id) FROM dbo.employees where position_id in (3,4) and is_active ='Y';
END
