CREATE PROCEDURE [dbo].[employees_upd]
(
    @tt    employees_tt READONLY
   ,@user_id int
)
AS
BEGIN
-- Update Process
   DECLARE @client_id INT;
   DECLARE @stmt NVARCHAR(MAX);
   SELECT @client_id = company_id FROM dbo.users_v where user_id=@user_id;
   CREATE TABLE #emp (
	[id] [int] NULL,
	[is_edited] [char](1) NULL,
	[client_id] [int] NULL,
	[employee_no] [nvarchar](50) NULL,
	[last_name] [nvarchar](50) NULL,
	[first_name] [nvarchar](50) NULL,
	[middle_name] [nvarchar](50) NULL,
	[name_suffix] [nvarchar](50) NULL,
	[gender] [char](1) NULL,
	[civil_status_code] [char](1) NULL,
	[date_hired] [date] NULL,
	[empl_type_code] [char](1) NULL,
	[department_id] [int] NULL,
	[section_id] [int] NULL,
	[emp_hash_key] [nvarchar](500) NULL,
	[position_id] [int] NULL,
	[basic_pay] [decimal](18, 2) NULL,
	[pay_type_code] [char](1) NULL,
	[sss_no] [nvarchar](50) NULL,
	[tin] [nvarchar](50) NULL,
	[philhealth_no] [nvarchar](50) NULL,
	[hmdf_no] [nvarchar](50) NULL,
	[account_no] [nvarchar](50) NULL,
	[no_shares] [decimal](10, 2) NULL,
	[contact_name] [nvarchar](50) NULL,
	[contact_phone_no] [nvarchar](50) NULL,
	[contact_address] [nvarchar](50) NULL,
	[contact_relation_id] [int] NULL,
	[is_active] [varchar](1) NULL,
	[inactive_type_code] [char](1) NULL,
	[inactive_date] [date] NULL)
	
	INSERT INTO #emp SELECT * FROM @tt;
   SET @stmt = CONCAT('
	UPDATE a 
		   SET 
	   	      employee_no				= b.employee_no
			 ,last_name					= b.last_name				
			 ,first_name				= b.first_name			
			 ,middle_name				= b.middle_name			
	 		 ,name_suffix				= b.name_suffix			
			 ,gender					= b.gender				
	   	     ,civil_status_code			= b.civil_status_code
			 ,date_hired				= b.date_hired
			 ,empl_type_code			= b.empl_type_code
			 ,department_id				= b.department_id
			 ,section_id				= b.section_id
			 ,emp_hash_key				= b.emp_hash_key
			 ,position_id				= b.position_id
			 ,basic_pay					= b.basic_pay
			 ,pay_type_code				= b.pay_type_code
			 ,sss_no					= b.sss_no
			 ,tin						= b.tin
			 ,philhealth_no				= b.philhealth_no
			 ,hmdf_no					= b.hmdf_no
			 ,account_no				= b.account_no
			 ,no_shares					= b.no_shares
			 ,contact_name				= b.contact_name
			 ,contact_phone_no			= b.contact_phone_no
			 ,contact_address			= b.contact_address
			 ,contact_relation_id		= b.contact_relation_id
			 ,is_active					= b.is_active
			 ,inactive_type_code		= b.inactive_type_code
			 ,inactive_date				= b.inactive_date
			 ,updated_by				=', @user_id ,'
			 ,updated_date				= DATEADD(HOUR, 8, GETUTCDATE())
        FROM dbo.employees_',@client_id,' a INNER JOIN #emp b
	     ON a.id = b.id 
		WHERE b.id IS NOT NULL
	    AND isnull(b.is_edited,''N'')=''Y''')
   EXEC(@stmt);

-- Insert Process
	SET @stmt = CONCAT('INSERT INTO employees_',@client_id,'(
		 employee_no		
		,last_name			
		,first_name		
		,middle_name		
		,name_suffix		
		,gender			
		,civil_status_code	
		,date_hired
		,empl_type_code	
		,department_id
		,section_id
		,emp_hash_key
		,position_id
		,basic_pay			
		,pay_type_code		
		,sss_no			
		,tin				
		,philhealth_no		
		,hmdf_no			
		,account_no		
		,no_shares
		,contact_name
		,contact_phone_no
		,contact_address
		,contact_relation_id
		,is_active			
		,inactive_type_code
		,inactive_date		
		,created_by
		,created_date
    )
	SELECT 
         employee_no
		,last_name			
		,first_name		
		,middle_name		
		,name_suffix		
		,gender			
		,civil_status_code	
		,date_hired
		,empl_type_code	
		,department_id
		,section_id
		,NEWID()
		,position_id
		,basic_pay			
		,pay_type_code		
		,sss_no			
		,tin				
		,philhealth_no		
		,hmdf_no			
		,account_no	
		,no_shares
		,contact_name
		,contact_phone_no
		,contact_address
		,contact_relation_id
		,is_active			
		,inactive_type_code
		,inactive_date		
		,',@user_id,'
	    ,DATEADD(HOUR, 8, GETUTCDATE())
	FROM #emp
	WHERE id IS NULL
      AND last_name IS NOT NULL
	  AND first_name IS NOT NULL
	  ');
   EXEC(@stmt);
   DROP TABLE #emp;
END;

