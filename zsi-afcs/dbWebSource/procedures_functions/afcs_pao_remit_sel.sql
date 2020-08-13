

CREATE PROCEDURE [dbo].[afcs_pao_remit_sel]  
(  
	 @vehicle_hash_key NVARCHAR(100)
    ,@hash_key NVARCHAR(MAX)
   , @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;
	DECLARE @stmt NVARCHAR(MAX);
    DECLARE @client_id  INT;
	DECLARE @vehicle_plate_no NVARCHAR(10)
	DECLARE @pao_id     INT;
	DECLARE @pao_name   NVARCHAR(100)
	DECLARE @cash_amount DECIMAL(10,2)
	DECLARE @tbl_employees NVARCHAR(50);
	DECLARE @tbl_client_payment NVARCHAR(50);
	DECLARE @tbl TABLE (
	    pao_id INT
	   ,pao_name NVARCHAR(100)
	)
	DECLARE @tbl_amt TABLE (
	    cash_amount decimal(10,2)
	)
	
	SELECT @client_id=company_id, @vehicle_plate_no=vehicle_plate_no FROM dbo.active_vehicles_v WHERE hash_key =@vehicle_hash_key;
	SET @tbl_employees = CONCAT('zsi_hcm.dbo.employees_',@client_id, '_v');
	SET @tbl_client_payment = CONCAT('dbo.payments_',@client_id);
	
	SET @stmt = CONCAT('SELECT id, emp_lfm_name FROM ',@tbl_employees, ' WHERE emp_hash_key = ''',@hash_key,'''')
	INSERT INTO @tbl (pao_id,pao_name) EXEC(@stmt);
	SELECT @pao_id = pao_id, @pao_name=pao_name FROM @tbl;

	SET @stmt = CONCAT('SELECT sum(total_paid_amount) FROM ',@tbl_client_payment,' WHERE is_open = ''Y'' 
	                    AND is_client_qr=''Y'' AND pao_id=',@pao_id)
    INSERT INTO @tbl_amt EXEC(@stmt);
	SELECT @cash_amount =cash_amount FROM @tbl_amt

	SET @stmt = CONCAT('UPDATE ',@tbl_client_payment,' SET is_open = ''N'' WHERE is_open=''Y'' AND pao_id = ',@pao_id)
	EXEC(@stmt);

	SELECT @vehicle_plate_no AS vehicle_plate_no
		 , @pao_id   AS pao_id
		 , @pao_name AS pao_name
	  	 , ISNULL(@cash_amount,0) AS cash_amount; 
END;

--[dbo].[afcs_pao_remit_sel] @vehicle_hash_key = '8B0A68AC-BF01-4523-8542-0E4B7D6A481A',@hash_key='BD384C8C-218F-40D9-B337-2DE4F3272A6A'
--UPDATE dbo.payments_1 set is_client_qr='Y',is_open='Y';