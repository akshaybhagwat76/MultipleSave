using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebApplication.EDM;
namespace WebApplication.Controllers
{
    public class TestController : Controller
    {
        // GET: Test
        demoEntities db = new demoEntities();
        public ActionResult Index()
        {
            var random = RandomString(5);

            return View();
        }

        [HttpGet]
        public JsonResult GetData()
        {
            var data = (from cust in db.Customers
                        from add in db.Addresses
                        from pay in db.payments
                        where add.c_id == cust.c_id && pay.c_id == cust.c_id
                        select new
                        {
                            cust.c_id,
                            add.add_id,
                            pay.p_id,
                            cust.cemail,
                            add.c_address,
                            pay.p_amount
                        }).Distinct().ToList();


            return Json(data, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveMasterDetail(string c_email, string p_amount, string c_address, int c_id, int add_id, int p_id)
        {
            bool result = false;

            if (c_id > 0)
            {
                var customer = db.Customers.Where(a => a.c_id == c_id).FirstOrDefault();
                customer.c_id = c_id;
                customer.cemail = c_email;
                db.SaveChanges();
            }
            if (add_id > 0)
            {
                var add = db.Addresses.Where(a => a.add_id == add_id).FirstOrDefault();
                add.c_address = c_address;
                add.add_id = add_id;
                db.SaveChanges();
            }
            if (p_id > 0)
            {
                var pay = db.payments.Where(a => a.p_id == p_id).FirstOrDefault();
                pay.p_amount = Convert.ToDouble(p_amount);
                pay.p_id = p_id;
                db.SaveChanges();
                result = true;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveDetails(string cemail, string cmobile, Address[] addressObj, payment[] paymentObj)
        {
            bool result = false;
            try
            {
                if (cemail != "" || cmobile != "")
                {
                    Customer objcust = new Customer();
                    objcust.cemail = cemail;
                    objcust.cmobile = cmobile;
                    db.Customers.Add(objcust);
                    db.SaveChanges();

                    int LetstCustId = objcust.c_id;

                    if (LetstCustId > 0 && addressObj.Length > 0 || addressObj != null)
                    {
                        foreach (var item in addressObj)
                        {
                            Address objadd = new Address();
                            objadd.c_address = item.c_address;
                            objadd.c_id = LetstCustId;
                            db.Addresses.Add(objadd);
                            db.SaveChanges();
                        }
                    }
                    if (paymentObj.Length > 0 && paymentObj != null)
                    {
                        foreach (var item in paymentObj)
                        {
                            payment objadd = new payment();
                            objadd.p_amount = item.p_amount;
                            objadd.c_id = LetstCustId;
                            db.payments.Add(objadd);
                            db.SaveChanges();
                            result = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result);
        }

        private Random random = new Random((int)DateTime.Now.Ticks);
        private string RandomString(int Size)
        {
            string input = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            StringBuilder builder = new StringBuilder();
            char ch;
            for (int i = 0; i < Size; i++)
            {
                ch = input[random.Next(0, input.Length)];
                builder.Append(ch);
            }
            return builder.ToString();
        }
    }
}